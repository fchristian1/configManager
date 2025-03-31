import AnsiToHtml from "ansi-to-html";

type SideMenuProps = { output: any };
export function ConsoleOutput({ output }: SideMenuProps) {
    const converter = new AnsiToHtml();
    const html = converter.toHtml(output);

    return (
        <pre
            style={{ whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
