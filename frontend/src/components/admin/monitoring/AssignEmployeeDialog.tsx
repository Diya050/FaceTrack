import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, CircularProgress
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useEffect, useState } from "react";
import { unknownFacesService } from "../../../services/unknownFaces";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (employeeId: string) => void;
}

interface Employee {
  user_id: string;
  full_name: string;
}

export default function AssignEmployeeDialog({ open, onClose, onSubmit }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const data = await unknownFacesService.getEmployees(inputValue);
        setEmployees(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchEmployees, 400); // debounce
    return () => clearTimeout(delay);
  }, [inputValue]);

  const handleSubmit = () => {
    if (!selected) return;
    onSubmit(selected.user_id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Assign Employee</DialogTitle>

      <DialogContent>
        <Autocomplete
          options={employees}
          getOptionLabel={(option) => option.full_name}
          loading={loading}
          onInputChange={(_, value) => setInputValue(value)}
          onChange={(_, value) => setSelected(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Employee"
              margin="normal"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress size={18} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
}