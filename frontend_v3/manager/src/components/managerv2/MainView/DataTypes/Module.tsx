type SideMenuProps = { modules: any[] };
export function DTModule({ modules }: SideMenuProps) {
    return <div>{modules.map((m) => m + " ")}</div>;
}
