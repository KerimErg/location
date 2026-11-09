"use client";

import dynamic from "next/dynamic";

export const GarageMapLazy = dynamic(() => import("./map"), { ssr: false, loading: () => <div className="blueprint h-full w-full bg-muted" /> });
