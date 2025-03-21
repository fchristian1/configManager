type SideMenuProps = { value: string };
export function DTMultiline({ value }: SideMenuProps) {
    return <textarea value={value}></textarea>;
}
