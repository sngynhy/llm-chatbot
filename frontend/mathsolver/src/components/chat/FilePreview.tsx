import { IconButton } from "components/ui/IconButton";
import { CgMathPlus } from "react-icons/cg";

interface FilePreviewProps {
  file: File;
  onClear: () => void;
}

export const FilePreview = ({ file, onClear }: FilePreviewProps) => {
  return (
    <div id="file">
      <span onClick={onClear}>
        <div>{file?.name}</div>
        <IconButton size="1rem" color="gray">
          <CgMathPlus style={{ transform: "rotate(45deg)" }} />
        </IconButton>
      </span>
    </div>
  );
};
