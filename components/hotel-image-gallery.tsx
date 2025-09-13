
interface HotelImageGalleryProps {
  images: Array<{ image_id: string } | string>;
  hotelName: string;
}
"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Grid3X3, Share, Heart, X, Camera, Bed, Utensils, Waves } from "lucide-react"
import Image from "next/image"






// HotelImageGallery: displays a gallery of hotel images from API data (no categories)
export function HotelImageGallery(props: HotelImageGalleryProps) {
  const { images, hotelName } = props;




  const [currentImage, setCurrentImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Map API images to URLs
  const imageUrls: string[] = Array.isArray(images)
    ? images.map((img: any) => {
        if (typeof img === 'object' && img !== null && 'image_id' in img && img.image_id) {
          return `//img1.hotelscan.com/640_440/1/${img.image_id}.jpg`;
        } else if (typeof img === 'string' && img.match(/^\d+$/)) {
          return `//img1.hotelscan.com/640_440/1/${img}.jpg`;
        } else if (typeof img === 'string' && img.startsWith('https')) {
          return img;
        } else {
          return '/placeholder.svg';
        }
      })
    : ['/placeholder.svg'];

  const nextImage = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % imageUrls.length);
  }, [imageUrls.length]);

  const prevImage = useCallback(() => {
    setCurrentImage((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  }, [imageUrls.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isGalleryOpen) return;
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextImage();
          break;
        case 'Escape':
          event.preventDefault();
          setIsGalleryOpen(false);
          break;
      }
    };
    if (isGalleryOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isGalleryOpen, nextImage, prevImage]);

  // Reset current image when gallery is opened
  useEffect(() => {
    setCurrentImage(0);
  }, [isGalleryOpen]);


  return (
    <div className="space-y-4">
      {/* Main Gallery Grid */}
      <div className="grid grid-cols-4 gap-2 h-96 rounded-lg overflow-hidden">
        {/* Main Image with Hero Overlay */}
        <div className="col-span-4 md:col-span-2 relative group cursor-pointer" onClick={() => setIsGalleryOpen(true)}>
          <Image
            src={imageUrls[0] || "/placeholder.svg"}
            alt={`${hotelName} - Main view`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Hero Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Hero Content */}
          <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-lg font-semibold mb-1">{hotelName}</h3>
            <p className="text-sm text-gray-200">
              {imageUrls.length} photos
            </p>
          </div>
          {/* View Gallery Button Overlay */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="sm" className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm">
              <Grid3X3 className="w-4 h-4 mr-1" />
              View Gallery
            </Button>
          </div>
        </div>
        {/* Thumbnail Grid */}
        <div className="col-span-4 md:col-span-2 grid grid-cols-2 gap-2">
          {imageUrls.slice(1, 5).map((url, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded"
              onClick={() => {
                setCurrentImage(index + 1);
                setIsGalleryOpen(true);
              }}
            >
              <Image
                src={url || "/placeholder.svg"}
                alt={`${hotelName} - View ${index + 2}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              {/* More Photos Overlay */}
              {index === 3 && imageUrls.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Grid3X3 className="w-6 h-6 mx-auto mb-1" />
                    <span className="font-semibold">+{imageUrls.length - 5}</span>
                    <br />
                    <span className="text-xs">more photos</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-white">
              <Grid3X3 className="w-4 h-4 mr-2" />
              View all {imageUrls.length} photos
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl w-full h-[90vh] p-0" aria-describedby="gallery-description">
            <div className="relative h-full bg-black">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
                onClick={() => setIsGalleryOpen(false)}
              >
                <X className="w-6 h-6" />
              </Button>
              {/* Main Image */}
              <div className="relative h-full">
                <Image
                  src={imageUrls[currentImage] || "/placeholder.svg"}
                  alt={`${hotelName} - Gallery view ${currentImage + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              {/* Navigation Arrows */}
              {imageUrls.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
                    onClick={prevImage}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
                    onClick={nextImage}
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}
              {/* Image Info Overlay */}
              <div className="absolute top-4 left-4 text-white">
                <div className="bg-black/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                  <h4 className="font-semibold">{hotelName}</h4>
                  <p className="text-sm text-gray-200">
                    {currentImage + 1} of {imageUrls.length}
                  </p>
                </div>
              </div>
              {/* Image Counter */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                {currentImage + 1} / {imageUrls.length}
              </div>
              {/* Thumbnails */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex justify-center space-x-2 overflow-x-auto max-w-full">
                  {imageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                        currentImage === index ? "border-white scale-110" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <Image
                        src={url || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        width={64}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
              {/* Keyboard Instructions */}
              <div className="absolute bottom-4 left-4 text-white text-xs bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                Use ← → keys to navigate • ESC to close
              </div>
            </div>
            <div id="gallery-description" className="sr-only">
              Hotel image gallery. Use arrow keys to navigate between images and escape key to close.
            </div>
          </DialogContent>
        </Dialog>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-white">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="bg-white">
            <Heart className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
