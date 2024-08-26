// PageTransition.js
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const variants = {
    initial: { opacity: 0, y: "-100%" },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: "100%" },
};

const PageTransition = ({ children }) => {
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
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden", // Prevent scrollbars
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default PageTransition;
