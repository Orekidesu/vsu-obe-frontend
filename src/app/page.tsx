"use client";

import Image from "next/image";
import vsuLogo from "../../public/assets/images/vsu_logo.png";
import vsuHomePageLogo from "../../public/assets/images/vsu_home_page_logo2.jpg";
import CustomLoginForm from "@/components/CustomLoginForm";

export default function LandingPage() {
  return (
    <div className="flex h-full w-full">
      {/* Left side - Illustration */}
      <div className="hidden w-1/2 bg-muted lg:block">
        <div className="flex h-full items-center justify-center">
          <Image
            src={vsuHomePageLogo}
            className="h-full"
            alt="home page logo"
            priority
          ></Image>
        </div>
      </div>

      <div className="flex w-full items-center justify-center lg:w-1/2 bg-background text-primary">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex flex-col justify-center items-center">
            <div>
              <Image
                src={vsuLogo}
                alt="vsu logo"
                className="h-28 w-28"
                priority
              ></Image>
            </div>
            <div className="pt-10 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">
                VSU OBE MANAGEMENT AND MONITORING SYSTEM
              </h1>
            </div>
          </div>
          <CustomLoginForm />
        </div>
      </div>
    </div>
  );
}
