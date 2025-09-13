"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import maplibregl, { Map as MapLibreMap, LngLatLike, MapLayerMouseEvent } from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, X } from "lucide-react"
import Image from "next/image"

type Hotel = {
  id: number | string
  name: string
  image?: string
  images?: string[]
  rating: number
  reviewCount: number
  price: number
  originalPrice?: number
  location: string
  distance: string
  amenities?: string[]
  badges: string[]
  coordinates: { lat: number; lng: number }
}

interface MapViewProps {
  hotels: Hotel[]
  hoveredHotelId?: string | number | null
  onHoverMarker?: (id: string | number | null) => void
  onMarkerClick?: (id: string | number) => void
}

export function MapView({ hotels, hoveredHotelId, onHoverMarker, onMarkerClick }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)

  const geojson = useMemo(() => ({
    type: "FeatureCollection",
    features: hotels
      .filter((h) => h.coordinates && Number.isFinite(h.coordinates.lat) && Number.isFinite(h.coordinates.lng))
      .map((h) => ({
        type: "Feature",
        properties: {
          id: String(h.id),
          name: h.name,
          price: h.price,
          priceLabel: `$${h.price}`,
        },
        geometry: {
          type: "Point",
          coordinates: [h.coordinates.lng, h.coordinates.lat],
        },
      })),
  }), [hotels])

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [100.5018, 13.7563] as LngLatLike, // Default to Bangkok
      zoom: 10,
      attributionControl: false,
    })

    mapRef.current = map

    map.on("load", () => {
      // Source with clustering
      if (!map.getSource("hotels")) {
        map.addSource("hotels", {
          type: "geojson",
          data: geojson as any,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        })
      }

      // Cluster circles
      if (!map.getLayer("clusters")) {
        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "hotels",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "#2563eb",
            "circle-radius": [
              "step",
              ["get", "point_count"],
              16,
              25,
              22,
              100,
              28,
            ],
            "circle-opacity": 0.9,
          },
        })
      }

      // Cluster count labels
      if (!map.getLayer("cluster-count")) {
        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "hotels",
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-size": 12,
          },
          paint: {
            "text-color": "#ffffff",
          },
        })
      }

      // Unclustered price labels
      if (!map.getLayer("unclustered-point")) {
        map.addLayer({
          id: "unclustered-point",
          type: "symbol",
          source: "hotels",
          filter: ["!has", "point_count"],
          layout: {
            "text-field": ["get", "priceLabel"],
            "text-size": 12,
            "text-offset": [0, 0.6],
            "text-allow-overlap": true,
          },
          paint: {
            "text-color": "#ffffff",
            "text-halo-color": "#1d4ed8",
            "text-halo-width": 6,
          },
        })
      }

      // Hover highlight layer (ring)
      if (!map.getLayer("hovered-point")) {
        map.addLayer({
          id: "hovered-point",
          type: "circle",
          source: "hotels",
          // Use legacy filter spec for TS compatibility
          filter: ["all", ["!has", "point_count"], ["==", "id", "__none__"]],
          paint: {
            "circle-radius": 18,
            "circle-color": "#93c5fd",
            "circle-opacity": 0.3,
            "circle-stroke-color": "#1d4ed8",
            "circle-stroke-width": 2,
          },
        })
      }

      // Cursor handling and events
      map.on("mouseenter", "unclustered-point", (e) => {
        map.getCanvas().style.cursor = "pointer"
        const id = e.features?.[0]?.properties?.id as string | undefined
        if (id && onHoverMarker) onHoverMarker(id)
      })
      map.on("mouseleave", "unclustered-point", () => {
        map.getCanvas().style.cursor = ""
        if (onHoverMarker) onHoverMarker(null)
      })

      // Click clusters to zoom in
      map.on("click", "clusters", (e: MapLayerMouseEvent) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] })
        const clusterId = features[0]?.properties?.cluster_id
        const source = map.getSource("hotels") as any
        if (source && clusterId) {
          source.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
            if (err) return
            const [lng, lat] = (features[0].geometry as any).coordinates
            map.easeTo({ center: [lng, lat], zoom })
          })
        }
      })

      // Click unclustered to select
      map.on("click", "unclustered-point", (e: MapLayerMouseEvent) => {
        const f = e.features?.[0]
        const id = f?.properties?.id as string | undefined
        if (!id) return
        const hotel = hotels.find((h) => String(h.id) === id) || null
        setSelectedHotel(hotel)
        if (onMarkerClick && id) onMarkerClick(id)
      })
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Update data when hotels change
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const src = map.getSource("hotels") as any
    if (src?.setData) {
      src.setData(geojson as any)
    }
  }, [geojson])

  // Update hover highlight when hoveredHotelId changes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const id = hoveredHotelId ? String(hoveredHotelId) : "__none__"
    // Use legacy form for equality to satisfy FilterSpecification types
    map.setFilter("hovered-point", ["all", ["!has", "point_count"], ["==", "id", id]])
  }, [hoveredHotelId])

  // Compute map center roughly around data
  const initialCenter = useMemo<LngLatLike>(() => {
    if (hotels.length === 0) return [100.5018, 13.7563]
    const first = hotels.find((h) => h.coordinates) || hotels[0]
    return [first.coordinates.lng, first.coordinates.lat]
  }, [hotels])

  // Recenter map when hotels list changes significantly
  useEffect(() => {
    const map = mapRef.current
    if (!map || hotels.length === 0) return
    const bounds = new maplibregl.LngLatBounds()
    hotels.forEach((h) => bounds.extend([h.coordinates.lng, h.coordinates.lat]))
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 14, duration: 400 })
    } else {
      map.easeTo({ center: initialCenter, zoom: 10 })
    }
  }, [hotels, initialCenter])

  return (
    <div className="relative h-[600px] bg-gray-200 rounded-lg overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Hotel Details Popup (React overlay) */}
      {selectedHotel && (
        <div className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-96">
          <Card className="shadow-xl">
            <CardContent className="p-0">
              <div className="relative">
                <Image
                  src={(selectedHotel.image || selectedHotel.images?.[0]) ?? "/placeholder.svg"}
                  alt={selectedHotel.name}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedHotel(null)}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{selectedHotel.name}</h3>
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{selectedHotel.location}</span>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{selectedHotel.rating}</span>
                  </div>
                  <span className="text-sm text-gray-600">({selectedHotel.reviewCount} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {selectedHotel.badges.slice(0, 2).map((badge) => (
                    <Badge key={badge} variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-bold text-blue-600">${selectedHotel.price}</span>
                      <span className="text-sm text-gray-600">/night</span>
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
