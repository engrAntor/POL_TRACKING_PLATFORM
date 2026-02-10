import React from 'react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Left Side - Image and Branding */}
            <div className="relative hidden w-[55%] flex-col justify-center px-20 lg:flex xl:w-[50%] bg-[#122b1c] text-white z-0">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img
                    src="/assets/images/profile.png"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />

                <div className="relative z-20 space-y-4 max-w-xl text-white">
                    <h1 className="text-[3.5rem] font-bold leading-[1.1] tracking-tight">
                        POL Tracking
                    </h1>
                    <h1 className="text-[3.5rem] font-bold leading-[1.1] tracking-tight mb-6">
                        Platform
                    </h1>
                    <p className="text-[1.15rem] font leading-relaxed opacity-90 pr-10 hover:text-gray-200">
                        Inventory management and intelligent tracking to optimize POL operations and reduce waste
                    </p>
                </div>

                {/* AVN Logo Placeholder on the image side (bottom left or center as per design? 
            Looking at the image, there's a logo on the plane, but also a logo on the form side.
            Let's stick to the text for now as per the "Left Side" description in plan.
        */}
            </div>

            {/* Right Side - Form Content */}
            <div className="flex w-full flex-col items-center justify-start px-6 pt-0 pb-32 lg:w-[45%] xl:w-[50%] bg-white overflow-y-auto">
                <div className="w-full max-w-[600px] space-y-8">
                    <div className="flex justify-center mb-8">
                        {/* AVN Logo */}
                        <div className="flex flex-col items-center">
                            {/* Placeholder for Logo */}
                            <img
                                src="/assets/logo/logo.png"
                                alt="AVN Logo"
                                width={300}
                                height={300}
                            />
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
