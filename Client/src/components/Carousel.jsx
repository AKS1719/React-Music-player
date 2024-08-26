import React, { useEffect, useRef, useState } from "react";
import { Box, Image } from "@chakra-ui/react";
import gsap from "gsap";

const slides = [
    { type: "image", src: "/carousel/carousel1.jpg" },
    { type: "video", src: "/carousel/carousel6.mp4" },
    { type: "image", src: "/carousel/carousel2.jpg" },
    { type: "video", src: "/carousel/carousel4.mp4" },
    { type: "image", src: "/carousel/carousel3.jpg" },
    { type: "video", src: "/carousel/carousel5.mp4" },
];

// Add a clone of the first slide to the end of the slides array
const extendedSlides = [...slides, slides[0]];

const Carousel = () => {
    const carouselRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = slides.length; // Original number of slides

    useEffect(() => {
        const slideShow = gsap.timeline();
        let timer;

        const moveToNextSlide = () => {
            if (currentSlide === totalSlides) {
                // Jump to the real first slide without animation
                gsap.set(carouselRef.current, { x: "0%" });
                setCurrentSlide(1);
            } else {
                setCurrentSlide((prev) => prev + 1);
            }
        };

        if (extendedSlides[currentSlide].type === "video") {
            slideShow.to(carouselRef.current, {
                x: `-${100 * currentSlide}%`,
                duration: 2,
                ease: "power1.inOut",
            });
            const video = document.getElementById(
                `slide-video-${currentSlide}`
            );
            if (video) {
                video.play();
                timer = setTimeout(() => {
                    video.currentTime = 0; // Reset video to the start
                    moveToNextSlide();
                    video.pause();
                }, 5000); // Adjust time for video slide
            }
        } else {
            slideShow.to(carouselRef.current, {
                x: `-${100 * currentSlide}%`,
                duration: 2,
                ease: "power1.inOut",
            });

            timer = setTimeout(() => {
                moveToNextSlide();
            }, 5000); // Adjust time for each image slide
        }

        return () => clearTimeout(timer);
    }, [currentSlide]);

    return (
        <Box
            ref={carouselRef}
            w="100%"
            h="100vh"
            position="relative"
            display="flex"
            transition="none"
        >
            {extendedSlides.map((slide, index) => (
                <Box
                    key={index}
                    flex="none"
                    w="100%"
                    h="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    {slide.type === "image" ? (
                        <Image
                            src={slide.src}
                            alt={`slide-${index}`}
                            objectFit="cover"
                            w="100%"
                            h="100%"
                        />
                    ) : (
                        <video
                            id={`slide-video-${index}`}
                            src={slide.src}
                            muted
                            playsInline
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default Carousel;
