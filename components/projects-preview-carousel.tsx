import * as React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Project = {
    name: string;
    description: string;
    url: string;
    image?: string;
};

const projects = [
    "https://cdn.dribbble.com/userupload/43644547/file/original-28ef84347283e1b7a489d77324728414.png?resize=1024x768&vertical=center",
    "https://cdn.dribbble.com/userupload/11780963/file/original-e1137588dcd9baee25727a6a7f2d7ca7.png?resize=752x&vertical=center",
    "https://cdn.dribbble.com/userupload/43652155/file/original-7bfaba7e5b44fd048b1145232d1e81db.jpg?resize=752x&vertical=center",
    "/img/budgetbee.webp",
]

export function ProjectsPreviewCarousel() {
    return (
        <React.Fragment>
            <ScrollArea>
                <div className="flex w-max gap-4 pb-4">
                    {projects.map((project, i) => (
                        <React.Fragment key={i}>
                            <img className="subpixel-antialiased rounded-lg h-36 w-auto" src={project} />
                        </React.Fragment>
                    )
                    )}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </React.Fragment>
    );
}
