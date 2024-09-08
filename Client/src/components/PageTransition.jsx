import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const variants = {
    initial: { opacity: 0, y: "-100%" },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: "100%" },
};

const PageTransition = ({ children, aksW }) => {
    const location = useLocation();

    return (
        <AnimatePresence>
            <motion.div
                key={location.key}
                initial="initial"
                animate="in"
                exit="out"
                variants={variants}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                    width: aksW,  // Ensure this correctly applies the width
                    height: "100%",  // Maintain 100% height to avoid overflow issues
                    overflow: "hidden",  // Prevent scrollbars during animation
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default PageTransition;
