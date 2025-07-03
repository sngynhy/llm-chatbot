import IconButton from "components/ui/IconButton";
import { CgMathPlus } from "react-icons/cg";

export default function FilePreview({ file, onClear }) {
    return (
        <div id="file">
            <span onClick={onClear}>
                <div>{file?.name}</div>
                <IconButton size={15} color='gray'>
                    <CgMathPlus style={{ transform: 'rotate(45deg)' }} />
                </IconButton>
            </span>
        </div>
    )
}