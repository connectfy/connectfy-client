import { FC, ForwardRefExoticComponent, Fragment, RefAttributes } from "react";
import "./customSelect.style.css";
import { ChevronRight, LucideProps } from "lucide-react";
import useBoolean from "@/hooks/useBoolean";
import SelectionModal from "@/components/Modal/SelectionModal/SelectionModal";

interface Selections {
  name: string;
  title?: string;
  onClick: () => void;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  key: string;
}

interface OptionProps {
  title: string;
  selections: Selections[];
  activeKey: string;
}

interface Props {
  buttonTitle: string;
  options: OptionProps;
}

const CustomSelect: FC<Props> = ({ buttonTitle, options }) => {
  const { open, onOpen, onClose } = useBoolean();
  const buttonName =
    options.selections.find((s) => s.key === options.activeKey)?.title ||
    buttonTitle;

  return (
    <Fragment>
      <div className="select-wrapper">
        <div className="custom-select" onClick={onOpen}>
          {buttonName}
        </div>

        <ChevronRight size={20} className="select-icon" />
      </div>

      {open && (
        <SelectionModal
          open={open}
          title={options.title}
          selections={options.selections}
          onClose={onClose}
          activeKey={options.activeKey}
        />
      )}
    </Fragment>
  );
};

export default CustomSelect;
