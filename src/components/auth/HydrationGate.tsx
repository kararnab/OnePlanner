"use client";

/**
 * https://medium.com/intelliconnect-engineering/fixing-hydration-issues-in-next-js-and-zustand-a-simple-solution-bd0a8deff6cc
 */
import { useEffect, useState } from "react"

// @ts-expect-error("Any")
const HydrationGate = ({ children }) => {
    const [isHydrated, setIsHydrated] = useState(false)

    // Wait till Next.js rehydration completes
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsHydrated(true)
    }, [])

    return <>{isHydrated ? <div>{children}</div> : null}</>
}

export default HydrationGate
