import { createElement, useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import { useForm } from "react-hook-form";
import cn from "classnames";

import "./editable_text.scss";



interface EditableTextProps {
    text: string | undefined;
    tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p";
    textClassName?: string;
    inputClassName?: string;
    onSuccess(value: string, callback: () => void): void;
    onCancel?(): void;
}

const EditableText = ({ text, tag, textClassName, inputClassName, onSuccess, onCancel, ...rest }: EditableTextProps) => {
    const { handleSubmit, register } = useForm<{ newValue: string }>(); // Adjust the type of the newValue here

    const [ editing, setEditing ] = useState(false);

    const handleSubmitSuccess = ({ newValue }: { newValue: string}) => {
        onSuccess(newValue, () => {
            setEditing(false);
        });
    };

    const cancel = () => {
        setEditing(false);

        if(onCancel) {
            onCancel();
        }
    };

    const clickOutsideRef = useOnclickOutside(cancel);

    return (
        <div {...rest} ref={clickOutsideRef} className="editable-text" onClick={() => setEditing(true)}>
            {!editing ? (
                createElement(
                    tag, 
                    { className: cn("editable-text__title", textClassName) }, 
                    (
                        <>
                            {text} <i className="fas fa-pencil-alt editable-text__icon" />
                        </>
                    )
                )
            ) : (
                <form onSubmit={handleSubmit(handleSubmitSuccess)}>
                    <input type="text" className={cn(inputClassName)} {...register("newValue", { required: "Required" })} defaultValue={text} />
                </form>
            )}
        </div>
    );
};

export default EditableText;