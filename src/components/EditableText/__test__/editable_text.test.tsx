import { fireEvent, render, screen } from "@testing-library/react";

import EditableText from "../editable_text";



describe("<EditableText />", () => {
    it("Matches snapshot", () => {
        render(
            <EditableText text="test text" tag="p" onSuccess={jest.fn()} />
        );
        
        // Use screen.queryByTestId method
        const EditableTextElement = screen.queryByTestId("editable-text-element");
        expect(EditableTextElement).toMatchSnapshot();
    });

    it("Receives text", () => {
        const testText = "testText";

        render(
            <EditableText text={testText} tag="p" onSuccess={jest.fn()} />
        );
        
        const EditableTextElement = screen.queryByTestId("editable-text-element");
        expect(EditableTextElement).toHaveTextContent(testText);
    });

    it("Receives tag", () => {
        const testTag = "p";

        render(
            <EditableText text="testText" tag={testTag} onSuccess={jest.fn()} />
        );
        
        const EditableTextElement = screen.queryByTestId("editable-text-element");
        expect(EditableTextElement).toLowerCase().toBe(testTag);
    });

    it("Editable mode", () => {
        render(
            <EditableText text="testText" tag="p" onSuccess={jest.fn()} />
        );
        
        const EditableTextElement = screen.queryByTestId("editable-text-element");

        fireEvent.click(EditableTextElement as HTMLElement);

        expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("Input receives classname", () => {
        const inputClassName = "testClassName";

        render(
            <EditableText text="testText" tag="p" inputClassName={inputClassName} onSuccess={jest.fn()} />
        );
        
        const EditableTextElement = screen.queryByTestId("editable-text-element");

        fireEvent.click(EditableTextElement as HTMLElement);

        expect(screen.getByRole("textbox")).toHaveClass(inputClassName);
    });

    it("Input receives default text", () => {
        const textValue = "Some test value";

        render(
            <EditableText text={textValue} tag="p" onSuccess={jest.fn()} />
        );
        
        const EditableTextElement = screen.queryByTestId("editable-text-element");

        fireEvent.click(EditableTextElement as HTMLElement);
        
        expect(screen.getByRole("textbox").getAttribute("value")).toBe(textValue);
    });

    it("onSuccess called", async () => {
        const onSuccess = jest.fn();

        render(
            <EditableText text="testtext" tag="p" onSuccess={onSuccess} />
        );
        
        const EditableTextElement = screen.queryByTestId("editable-text-element");
        
        fireEvent.click(EditableTextElement as HTMLElement);

        fireEvent.submit(screen.getByRole("form"));

        expect(onSuccess).toBeCalledTimes(1);
    });
});