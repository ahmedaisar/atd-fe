"use client"

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

// Lightweight shimmer svg generator
function shimmer(w: number, h: number) {
	return `data:image/svg+xml;base64,${Buffer.from(
		`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><defs><linearGradient id="g"><stop stop-color="#f3f3f3" offset="20%"/><stop stop-color="#e2e2e2" offset="50%"/><stop stop-color="#f3f3f3" offset="70%"/></linearGradient></defs><rect width="${w}" height="${h}" fill="#f3f3f3"/><rect id="r" width="${w}" height="${h}" fill="url(#g)"/><animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite"  /></svg>`
	).toString('base64')}`
}

interface OfferImageProps extends Omit<ImageProps, 'placeholder'> {
	aspect?: string // tailwind aspect ratio utility (e.g. 'aspect-[5/2]')
	radius?: string // rounding utility
}

export function OfferImage({ aspect = 'aspect-[5/2]', radius = 'rounded-none', alt, className = '', ...rest }: OfferImageProps) {
	const [loaded, setLoaded] = useState(false)
	return (
		<div className={`relative w-full ${aspect} overflow-hidden ${radius}`}>
			<Image
				alt={alt}
				fill
				onLoad={() => setLoaded(true)}
				className={`object-cover transition-transform duration-500 group-hover:scale-105 ${className} ${loaded ? 'opacity-100' : 'opacity-0'}`}
				placeholder="blur"
				blurDataURL={shimmer(700,280)}
				{...rest}
			/>
			{!loaded && (
				<div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
			)}
		</div>
	)
}

export default OfferImage
