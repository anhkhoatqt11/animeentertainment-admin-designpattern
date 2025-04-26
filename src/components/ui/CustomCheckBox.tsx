import React from "react";
import { useCheckbox, Chip, VisuallyHidden, tv } from "@nextui-org/react";
import { CheckIcon } from "./CheckIcon";

const checkbox = tv({
  slots: {
    base: "border-default hover:bg-default-200 p-4",
    content: "text-default-500",
  },
  variants: {
    isSelected: {
      true: {
        base: `border-emerald-400 border-3 bg-gradient-to-r from-emerald-400 to-blue-500  text-white`,
        content: `text-primary-foreground pl-1 font-medium`,
      },
    },
    isFocusVisible: {
      true: {
        base: "outline-none ring-2 ring-focus ring-offset-2 ring-offset-background",
      },
    },
  },
});

export const CustomCheckbox = (props) => {
  const {
    children,
    isSelected,
    isFocusVisible,
    getBaseProps,
    getLabelProps,
    getInputProps,
  } = useCheckbox({
    ...props,
  });

  const styles = checkbox({ isSelected, isFocusVisible });

  return (
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <Chip
        classNames={{
          base: styles.base(),
          content: styles.content(),
        }}
        className={`text-[#17d1c6]`}
        startContent={
          isSelected ? <CheckIcon className="ml-1 text-white" /> : null
        }
        variant="faded"
        {...getLabelProps()}
      >
        {children ? children : isSelected ? "Enabled" : "Disabled"}
      </Chip>
    </label>
  );
};
