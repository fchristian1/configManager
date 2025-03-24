type SideMenuProps = { onChange: any; value: string; name: string };
export function DTMultiline({ onChange, value, name }: SideMenuProps) {
    return (
        <textarea
            className="flex bg-transparent disabled:opacity-50 shadow-sm px-3 py-2 border border-input rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full min-h-[60px] placeholder:text-muted-foreground md:text-sm text-base disabled:cursor-not-allowed"
            onChange={onChange}
            value={value}
            name={name}
        ></textarea>
    );
}
