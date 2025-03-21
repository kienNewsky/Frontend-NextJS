"use client";
import {
  selectCategoryProducts,
  setSelectedCategory,
  setSelectedProduct,
} from "@/redux/categoryProductRedux";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import FolderOpenTwoToneIcon from "@mui/icons-material/FolderOpenTwoTone";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { deleteData, getData, postData, putData } from "@/hook/Hook";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { format } from "date-fns";
import Autocomplete from "@mui/material/Autocomplete";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
export default function DetailProduct(props) {
  const selectedCategory = useSelector(
    (state) => state.categoryProduct.selectedCategory
  );
  const [classPriceData, setClassPriceData] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [measurementData, setMeasurementData] = useState([]);
  const [segmmentData, setSegmentData] = useState([]);
  const date = new Date();
  const currentDate = dayjs(date).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

  const [selectedDataGrid, setSelectedDataGrid] = useState({
    nameStr: "",
    extraCategoryID: selectedCategory,
    minimumStock: 0,
    mayBeBuy: false,
    mayBeProduce: false,
    mayBeSell: false,
    canSellWithOutStock: false,
    disContinue: false,
    classPriceID: "",
    segmentID: "",
    comment: "",
    copyFrom: "",
    createdOn: currentDate,
    measID: "",
  });

  const [openConfirm, setOpenConfirm] = React.useState(false);
  const dispatch = useDispatch();

  console.log(selectedDataGrid);
  // console.log(measurementData);
  useEffect(() => {
    const getClassPriceData = async () => {
      try {
        const result = await getData("/product-service/classPrice");
        const result2 = await getData("/product-service/classes");
        const result3 = await getData("/product-service/Measurement");
        const result4 = await getData("/produce-service/segment");
        const changeFieldName = result.map((item) => {
          const classesName = result2.find(
            (classes) => classes.id === item.classId
          ).nameStr;
          console.log(classesName); // Tạo trường label từ trường nameStr
          return {
            ...item,
            label: classesName,
          };
        });
        setClassPriceData(changeFieldName);

        // Đổi tên trường nameStr thành label để phù hợp dữ liệu đầu vào autocomplete
        const changeFieldName2 = result2.map((item) => {
          return {
            ...item,
            label: item.nameStr, // Tạo trường label từ trường nameStr
          };
        });
        setClassesData(changeFieldName2);

        const changeFieldName3 = result3.map((item) => {
          return {
            ...item,
            label: item.measName, // Tạo trường label từ trường measName
          };
        });

        setMeasurementData(changeFieldName3);
        const changeFieldName4 = result4.map((item) => {
          return {
            ...item,
            label: item.segmentName, // Tạo trường label từ trường segmentName
          };
        });

        setSegmentData(changeFieldName4);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getClassPriceData();

    console.log("rendering again");
  }, []);
  const handleOpenConfirm = (event) => {
    setOpenConfirm(true);
    // setAddCategory({ isChildOf: selectedSingleNode });
  };
  const handleCloseConfirm = (event) => {
    event.preventDefault();
    setOpenConfirm(false);
  };
  function FormConfirmDialog(open) {
    // const getClassesName = classesData.find(
    //   (classes) => classes.id === selectedDataGrid.classId
    // );
    return (
      <React.Fragment>
        <Dialog
          open={open.open}
          onClose={handleCloseConfirm}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const respone = postData(
                "/product-service/product",
                selectedDataGrid
              );
              console.log(respone);
              handleCloseConfirm(event);
              alert("Thêm thành công");
              props.handleCloseAddproduct();
            },
          }}
        >
          <DialogTitle>
            Thêm:{" "}
            <span style={{ fontWeight: "bold" }}>
              {selectedDataGrid.nameStr}
            </span>
          </DialogTitle>
          <DialogContent>Bạn chắc chắn muốn thêm sản phẩm này?</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirm}>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "auto",
      }}
      // onSubmit={handleOpenConfirm}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <TextField
          required
          id="nameStr"
          variant="outlined"
          label="Tên sản phẩm"
          sx={{ marginTop: 2, width: "91%", marginLeft: 5 }}
          value={selectedDataGrid?.nameStr && selectedDataGrid?.nameStr}
          onChange={(event) => {
            const updatedSelectedDataGrid = { ...selectedDataGrid };
            updatedSelectedDataGrid.nameStr = event.target.value;

            setSelectedDataGrid(updatedSelectedDataGrid);
          }}
        />
        <Autocomplete
          disablePortal
          id=""
          options={measurementData}
          sx={{ marginTop: 2, marginX: 5, width: "91%" }}
          renderInput={(params) => (
            <TextField {...params} label="Đơn vị quy chuẩn" />
          )}
          value={
            measurementData.length > 0
              ? measurementData.find(
                  (measurement) => measurement.id === selectedDataGrid.measID
                )
              : ""
          }
          onChange={(event, value) => {
            if (value) {
              const updatedSelectedDataGrid = { ...selectedDataGrid };
              updatedSelectedDataGrid.measID = value.id;
              setSelectedDataGrid(updatedSelectedDataGrid);
            }
          }}
          //   onChange={handleOnChange}
        />
        <Autocomplete
          disablePortal
          id=""
          options={["None", ...segmmentData]}
          sx={{ marginTop: 2, marginX: 5, width: "91%" }}
          renderInput={(params) => (
            <TextField {...params} label="Công đoạn sản xuất" />
          )}
          value={
            segmmentData.length > 0
              ? segmmentData.find(
                  (segmment) => segmment.id === selectedDataGrid.segmentID
                )
              : ""
          }
          onChange={(event, value) => {
            if (value && value != "None") {
              const updatedSelectedDataGrid = { ...selectedDataGrid };
              updatedSelectedDataGrid.segmentID = value.id;
              setSelectedDataGrid(updatedSelectedDataGrid);
            } else {
              const updatedSelectedDataGrid = { ...selectedDataGrid };
              updatedSelectedDataGrid.segmentID = "";
              setSelectedDataGrid(updatedSelectedDataGrid);
            }
          }}
          //   onChange={handleOnChange}
        />
        <TextField
          required
          id="minimumStock"
          variant="outlined"
          label="Tồn kho tối thiểu"
          type="number"
          sx={{ marginTop: 2, marginLeft: 5, width: "30%" }}
          value={
            selectedDataGrid?.minimumStock && selectedDataGrid?.minimumStock
          }
          onChange={(event) => {
            const updatedSelectedDataGrid = { ...selectedDataGrid };
            updatedSelectedDataGrid.minimumStock = Number(event.target.value);

            setSelectedDataGrid(updatedSelectedDataGrid);
          }}
        />
        <Autocomplete
          id="combo-box-demo"
          options={classPriceData}
          sx={{ marginTop: 2, marginX: 5, width: "57%" }}
          renderInput={(params) => (
            <TextField {...params} label="Class giá hạch toán" />
          )}
          value={
            classPriceData.length > 0
              ? classPriceData.find(
                  (classPrice) =>
                    classPrice.id === selectedDataGrid.classPriceID
                )
              : ""
          }
          onChange={(event, value) => {
            if (value) {
              const updatedSelectedDataGrid = { ...selectedDataGrid };
              updatedSelectedDataGrid.classPriceID = value.id;
              setSelectedDataGrid(updatedSelectedDataGrid);
            }
          }}
          //   onChange={handleOnChange}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedDataGrid?.mayBeBuy}
              onClick={(event) => {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.mayBeBuy = !selectedDataGrid?.mayBeBuy;
                setSelectedDataGrid(updatedSelectedDataGrid);
              }}
            />
          }
          label="Có thể mua"
          sx={{ marginTop: 2, marginX: 5 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedDataGrid?.mayBeSell}
              onClick={(event) => {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.mayBeSell =
                  !selectedDataGrid?.mayBeSell;
                setSelectedDataGrid(updatedSelectedDataGrid);
              }}
            />
          }
          label="Có thể bán"
          sx={{ marginTop: 2, marginX: 5 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedDataGrid?.mayBeProduce}
              onClick={(event) => {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.mayBeProduce =
                  !selectedDataGrid?.mayBeProduce;
                setSelectedDataGrid(updatedSelectedDataGrid);
              }}
            />
          }
          label="Có thể sản xuất"
          sx={{ marginTop: 2, marginX: 5 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedDataGrid?.canSellWithOutStock}
              onClick={(event) => {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.canSellWithOutStock =
                  !selectedDataGrid?.canSellWithOutStock;
                setSelectedDataGrid(updatedSelectedDataGrid);
              }}
            />
          }
          label="Có thể bán mà không có SP tồn kho"
          sx={{ marginTop: 2, marginX: 5 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedDataGrid?.disContinue}
              onClick={(event) => {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.disContinue =
                  !selectedDataGrid?.disContinue;
                setSelectedDataGrid(updatedSelectedDataGrid);
              }}
            />
          }
          label="Không sử dụng sản phẩm này nữa"
          sx={{ marginTop: 2, marginX: 5 }}
        />

        <TextField
          multiline
          id=""
          variant="outlined"
          label="Ghi chú"
          sx={{ marginTop: 2, marginLeft: 5, width: "91%" }}
          value={selectedDataGrid?.comment}
          onChange={(event) => {
            const updatedSelectedDataGrid = { ...selectedDataGrid };
            updatedSelectedDataGrid.comment = event.target.value;
            console.log(event.target.value);
            setSelectedDataGrid(updatedSelectedDataGrid);
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: 6,
            width: "100%",
            position: "sticky",
            bottom: 0,
            height: "80px",
            background: "rgb(239,239,239,0.8)",
          }}
        >
          <Button
            variant="contained"
            sx={{ margin: 2 }}
            onClick={props.handleCloseAddproduct}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="warning"
            variant="contained"
            sx={{ margin: 2 }}
            onClick={handleOpenConfirm}
          >
            Save
          </Button>
          <FormConfirmDialog open={openConfirm} />
        </div>
      </Box>
    </Box>
  );
}
