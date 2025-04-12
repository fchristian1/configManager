type SideMenuProps = { children: React.ReactNode };
export function Title({ children }: SideMenuProps) {
    return <div className="font-semibold">{children}</div>;
}
