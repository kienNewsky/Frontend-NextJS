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
import ProductAttribute from "../productAttribute/ProductAttribute";
export default function DetailProduct() {
  const selectedProduct = useSelector(
    (state) => state.categoryProduct.selectedProduct
  );
  const [classPriceData, setClassPriceData] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [measurementData, setMeasurementData] = useState([]);
  const [segmmentData, setSegmentData] = useState([]);
  const [selectedDataGrid, setSelectedDataGrid] = useState(selectedProduct);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openFixDialog, setOpenFixDialog] = React.useState(false);

  const dispatch = useDispatch();

  // console.log(selectedDataGrid);
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
          ).nameStr; // Tạo trường label từ trường nameStr
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

  const columns = [
    { field: "index", headerName: "STT", width: 10 },
    { field: "id", headerName: "id", width: 1 },

    {
      field: "classId",
      headerName: "Tên Class",
      width: 300,

      renderCell: (params) => {
        const className = classesData.find(
          (item) => item.id === params.row.classId
        )?.label;

        return (
          <Link
            underline="hover"
            key={params.row.id}
            color="inherit"
            variant="body1"
            onClick={() => {
              setSelectedDataGrid(params.row);
            }}
          >
            {className}
          </Link>
        );
      },
    },
    {
      field: "dateEffected",
      headerName: "Ngày áp dụng",
      width: 180,

      renderCell: (params) => {
        const formattedDate = format(
          new Date(params.row.dateEffected),
          "MM-dd-yyyy"
        );
        return (
          <Link
            underline="hover"
            key={params.row.id}
            color="inherit"
            variant="body1"
            onClick={() => {
              setSelectedDataGrid(params.row);
            }}
          >
            {formattedDate}
          </Link>
        );
      },
    },
    { field: "price", headerName: "Giá thành", width: 100 },

    {
      field: "defaultMeas",
      headerName: "Đơn vị mặc định",
      width: 120,

      renderCell: (params) => {
        const measName = measurementData.find(
          (item) => item.id === params.row.defaultMeas
        )?.label;

        return (
          <Link
            underline="hover"
            key={params.row.id}
            color="inherit"
            variant="body1"
            onClick={() => {
              setSelectedDataGrid(params.row);
            }}
          >
            {measName}
          </Link>
        );
      },
    },
  ];

  const handleOpenAdd = (event) => {
    event.preventDefault();
    setOpenAddDialog(true);
  };
  const handleClose = (event) => {
    event.preventDefault();
    setOpenAddDialog(false);
  };
  function FormAddDialog(open) {
    let selectedClassId = "";
    let selectedDefaultMeas = "";
    let selectedDateEffected = "";
    return (
      <React.Fragment>
        <Dialog
          open={open.open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());

              const dateEffected = selectedDateEffected;
              const classId = selectedClassId;
              const DefaultMeas = selectedDefaultMeas;
              const price = formJson.price;

              const addClassPrice = {
                classId: classId,
                defaultMeas: DefaultMeas,
                dateEffected: dateEffected,
                price: Number(price),
              };
              console.log(addClassPrice);

              const postMeasurement = async () => {
                try {
                  const result = await postData(
                    "/product-service/classPrice",
                    addClassPrice
                  );
                  const addClassPrice2 = result;
                  setClassPriceData((prevState) => [
                    ...prevState,
                    addClassPrice2,
                  ]);
                } catch (err) {
                  console.error("Error fetching data:", err);
                }
              };
              postMeasurement();

              alert("Thêm thành công !!!");
              handleClose(event);
            },
          }}
        >
          <DialogTitle>Thêm giá hạch toán</DialogTitle>
          <DialogContent>
            <Autocomplete
              disablePortal
              name="classId"
              options={classesData}
              sx={{ margin: 2 }}
              renderInput={(params) => (
                <TextField {...params} label="Tên Class" />
              )}
              onChange={(event, value) => {
                selectedClassId = value.id;
              }}
              //   onChange={handleOnChange}
            />
            <Autocomplete
              disablePortal
              name="defaultMeas"
              options={measurementData}
              sx={{ margin: 2 }}
              renderInput={(params) => (
                <TextField {...params} label="Đơn vị mặc định" />
              )}
              onChange={(event, value) => {
                selectedDefaultMeas = value.id;
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name="dateEffected"
                label="Ngày áp dụng"
                sx={{ margin: 2 }}
                onChange={(newValue) => {
                  selectedDateEffected = newValue.format(
                    "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
                  );
                }}
              />
            </LocalizationProvider>

            <TextField
              name="price"
              variant="outlined"
              label="Giá thành"
              sx={{ margin: 2, marginBottom: 22 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
  const handleOpenDelete = (event) => {
    setOpenDeleteDialog(true);
    // setAddCategory({ isChildOf: selectedSingleNode });
  };
  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
  };
  function FormDeleteDialog(open) {
    // const getClassesName = classesData.find(
    //   (classes) => classes.id === selectedDataGrid.classId
    // );
    return (
      <React.Fragment>
        <Dialog
          open={open.open}
          onClose={handleCloseDelete}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const respone = deleteData(
                "/product-service/product",
                selectedDataGrid.id
              );
              console.log(respone);
              // const updatedData = classPriceData.filter(
              //   (item) => item.id !== selectedDataGrid.id
              // );
              // setClassPriceData(updatedData);
              dispatch(setSelectedProduct(null));
              handleCloseDelete();
              alert("Xóa thành công");
            },
          }}
        >
          <DialogTitle>Xóa {selectedDataGrid.nameStr}</DialogTitle>
          <DialogContent>Bạn chắc chắn muốn xóa thư mục này?</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete}>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
  const handleOpenFix = (event) => {
    setOpenFixDialog(true);
    // setAddCategory({ isChildOf: selectedSingleNode });
  };
  const handleCloseFix = (event) => {
    event.preventDefault();
    setOpenFixDialog(false);
  };
  function FormFixDialog(open) {
    // const getClassesName = classesData.find(
    //   (classes) => classes.id === selectedDataGrid.classId
    // );
    return (
      <React.Fragment>
        <Dialog
          open={open.open}
          onClose={handleCloseFix}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const respone = putData(
                "/product-service/product",
                selectedDataGrid.id,
                selectedDataGrid
              );
              console.log(respone);
              // const updatedData = classPriceData.map((item) => {
              //   if (item.id === selectedDataGrid.id) {
              //     return selectedDataGrid;
              //   }
              //   return item;
              // });
              // setClassPriceData(updatedData);

              handleCloseFix(event);
              alert("Lưu thành công");
            },
          }}
        >
          <DialogTitle>
            Sửa:{" "}
            <span style={{ fontWeight: "bold" }}>
              {selectedDataGrid.nameStr}
            </span>
          </DialogTitle>
          <DialogContent>Bạn chắc chắn muốn lưu mục này?</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFix}>Cancel</Button>
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
    >
      <FormAddDialog open={openAddDialog} />
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <TextField
          id="nameStr"
          variant="outlined"
          label="Tên sản phẩm"
          sx={{ marginTop: 2, width: "91%", marginLeft: 5 }}
          value={selectedDataGrid?.nameStr}
          onChange={(event) => {
            const updatedSelectedDataGrid = { ...selectedDataGrid };
            updatedSelectedDataGrid.nameStr = event.target.value;

            setSelectedDataGrid(updatedSelectedDataGrid);
          }}
        />
        <Autocomplete
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
              console.log(value);
              setSelectedDataGrid(updatedSelectedDataGrid);
            }
          }}
          //   onChange={handleOnChange}
        />
        <Autocomplete
          id=""
          options={["None", ...segmmentData]}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
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
          id="minimumStock"
          variant="outlined"
          label="Tồn kho tối thiểu"
          type="number"
          sx={{ marginTop: 2, marginLeft: 5, width: "30%" }}
          value={selectedDataGrid?.minimumStock}
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
              console.log(value);
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
        <ProductAttribute
          title={"attName"}
          serviceURL={"/product-service/ProductAttribute"}
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
            onClick={() => {
              dispatch(setSelectedProduct(null));
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ margin: 2 }}
            onClick={handleOpenFix}
          >
            Save
          </Button>
          <FormFixDialog open={openFixDialog} />
          <Button
            color="error"
            variant="contained"
            sx={{ margin: 2 }}
            onClick={handleOpenDelete}
          >
            Delete
          </Button>
          <FormDeleteDialog open={openDeleteDialog} />
        </div>
      </Box>
    </Box>
  );
}
