import { useEffect } from "react";

type SideMenuProps = {
    onChange: any;
    value: string;
    name: string;
};
export function DTString({ onChange, value, name }: SideMenuProps) {
    useEffect(() => {
        // Simuliere ein Change-Event mit dem initialen Wert
        const event = {
            target: { value: "", name },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
    }, []);
    return (
        <div>
            <input
                type="text"
                name={name}
                className="flex justify-between items-center bg-transparent disabled:opacity-50 shadow-sm px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring ring-offset-background w-[180px] h-9 data-[placeholder]:text-muted-foreground text-sm [&>span]:line-clamp-1 whitespace-nowrap disabled:cursor-not-allowed"
                onChange={onChange}
                value={value}
            />
        </div>
    );
}
