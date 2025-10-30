import { Marquee } from "@/components/marquee";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const marquee = [
    {
        name: "Typer",
        src: "/img/typer.webp",
        href: "https://github.com/sammaji/typer",
    },
    {
        name: "Careshift",
        src: "/img/ss/careshift-mobile.webp",
        href: "/work/careshift",
    },
    {
        name: "Careshift",
        src: "/img/careshift-dashboard.webp",
        href: "/work/careshift",
    },
    {
        name: "Atomo",
        src: "/img/atomo.webp",
        href: "https://atomo.sammaji.com",
    },
];

export function ProjectsMarquee() {
    return (
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <Marquee pauseOnHover className="[--duration:20s]">
                {marquee.map((image, index) => (
                    <Dialog key={index}>
                        <DialogTrigger asChild>
                            <img
                                key={index}
                                className="h-48 rounded-md object-cover"
                                src={image.src}
                            />
                        </DialogTrigger>
                        <DialogContent className="w-full max-w-[calc(100vw-16px)] min-w-[50vw]">
                            <DialogHeader>
                                <DialogTitle className="font-semibold">
                                    {image.name}
                                </DialogTitle>
                            </DialogHeader>
                            <img
                                className="w-full rounded-md object-cover"
                                src={image.src}
                            />
                            <DialogFooter>
                                <Button className="mx-auto" asChild>
                                    <Link href={image.href}>
                                        Learn more <ArrowRight />
                                    </Link>
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                ))}
            </Marquee>
            {/*
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#111110]"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#111110]"></div>
            */}
        </div>
    );
}
