import React, { useState } from "react";
import { TextField, InputAdornment, CircularProgress } from "@mui/material";
import { GridSearchIcon } from "@mui/x-data-grid";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (searchTerm: string) => void;
  isLoading?: boolean;
}

export default function SearchDropMenuAtom({ placeholder, onSearch, isLoading = false }: SearchInputProps): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <TextField
      fullWidth
      value={searchTerm}
      placeholder={placeholder || "Search..."}
      onChange={handleInputChange}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <GridSearchIcon />
          </InputAdornment>
        ),
        endAdornment: isLoading ? (
          <InputAdornment position="end">
            <CircularProgress size={20} />
          </InputAdornment>
        ) : null,
      }}
    />
  );
}
