import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const ExportButton = () => {

  return (
    <Button
      variant="outlined"
      startIcon={<DownloadIcon />}
    >
      Export
    </Button>
  );
};

export default ExportButton;