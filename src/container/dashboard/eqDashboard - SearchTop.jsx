import React, { useState, useEffect, useMemo } from "react";
import { Box, IconButton, Tooltip, Skeleton } from "@mui/material";
import PNavbar from "../../component/PNavbar/PNavbar";
import PDropdown from "../../component/PDropdown/PDropdown";
import PDatepicker from "../../component/PDatepicker/PDatepicker";
import PDashboardCard from "../../component/PDashboardCard/PDashboardCard";
import PPieChart from "../../component/PChart/PPieChart";
import PBarChart from "../../component/PChart/PBarChart";
import PLineChart from "../../component/PChart/PLineChart";
import PTable from "../../component/PTable/PTable";
import { Labels } from "../../utils/constants/labels";
import PButton from "../../component/PButton/PButton";
import PTypography from "../../component/PTypography/PTypography";
import { CommonColors } from "../../utils/constants/colors";
import PGrid from "../../component/PGrid/PGrid";
import PCard from "../../component/PCard/PCard";
import ShowChartIcon from "@mui/icons-material/ShowChart"
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";

import PToggleCircle from "../../component/PToggle/PToggleCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import PSearch from "../../component/PSearch/PSearch";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import CheckCircleIcon from '@mui/icons-material/TaskAlt';
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import { FontFamily, FontWeight } from '../../utils/constants/fonts'
import { useLanguage } from "../../utils/constants/language";
import { Dashboard_API } from "../../utils/api/apiUrl";
import { PostApi } from "../../utils/api/networking";
import { exportToExcel, isNotEmpty, isSuccess } from "../../utils/commonFunction/common";
import { useNavigate } from "react-router-dom";
import { labelRoutes } from "../../navigations/labelRoutes";
import PDialog from "../../component/PDialog/PDialog";
import "./eqDashboard.css";
import Icon_export from "../../utils/assets/images/icon_export.svg";
import arrow from "../../utils/assets/images/arrow_white.svg";
const EqDashboard = () => {
  const navigate = useNavigate();
  const { getLabel } = useLanguage();
  const [openFilter, setOpenFilter] = useState("");
  //const [chartType, setChartType] = useState("pie");
  const [country, setCountry] = useState([]);
  const [filter, setFilter] = useState(false);
  const [rows, setRows] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [chartOrginalData, setChartOrginalData] = useState([]);
  const [formData, setFormData] = useState({
    country: "",
    user: "",
    startDate: "",
    endDate: "",
    search: "",
    chartType: "pie",
    status: "",
    createEnquiry: "Create Enquiry"
  });
  const [errors, setErrors] = useState({
    startDate: "",
    endDate: "",
  })
  const role = localStorage.getItem("role");
  const countryID = parseInt(localStorage.getItem("countryID"))
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await PostApi(Dashboard_API.Master, {
          userCountryId: countryID,
          role: role
        });
        setCountry(role === "Admin" ? response.country : response.country.filter((c) => c.value === countryID));
        const res = await PostApi(Dashboard_API.Dashboard, {
          userCountryId: countryID,
          role: role,
          createdName: 0,
          enqUId: "",
          projectNo: "",
          startDate: "",
          endDate: "",
          statusId: "",
          jobposition: "",
          client: "",
          username: localStorage.getItem("user"),
        });

        if (isSuccess(res)) {
          const data = res?.data;

          setSummary(data.summary || {});
          const formattedRows = (data.detailed || []).map(item => ({
            enquiryId: item.enquiryId,
            projectNumber: item.projectNo,
            projectName: item.projectDesc,
            requestedDate: item.serverTime,
            status: item.statusName,
            surveyStatus: item.surveyStatusName,
            countryID: item.pmgEntity,
            userID: item.clientId,
            jobStatusID: item.status,
            date: item.serverTime,
            id: item.id,
            stepID: item.stepId,
          }));
          setRows(formattedRows);
          const formattedChartData = (data.summary?.jobStatus || []).map(
            ({ statusName, enquiryCount, statusId }) => ({
              name: statusName,
              value: enquiryCount,
              id: statusId
            })
          );
          setChartData(formattedChartData);
          setChartOrginalData(formattedChartData);
        }
      } catch (error) {
        toast(Labels.status.failure, response.data.message);
      } finally {
        setLoading(false);
      }
    };
    handleReset();
    fetchData();
  }, []); // empty dependency: run only once on mount

  useEffect(() => {
    if (country.length === 1) {
      setFormData(prev => ({
        ...prev,
        country: country[0].value
      }));
    }
  }, [country]); // separate effect, only does auto-select

  const columns = [
    { field: "enquiryId", header: "Enquiry ID" },
    { field: "projectNumber", header: "Project Number" },
    { field: "projectName", header: "Project Name" },
    { field: "requestedDate", header: "Requested Date" },
    { field: "status", header: "Status" },
    { field: "surveyStatus", header: "Survey Status" },
  ];

  const cardData = [
    
    {
      title: getLabel("lbl13"),
      value: summary.approval || 0,
      subtitle: getLabel("lbl17"),
      iconColor: Labels.primary,
      icon: <PendingActionsIcon />,
      statusId: 3,
      bgColor: "#FAB01B",
      indicatorColor: "#ED3B25",
      position:"start",
    },
    {
      title: getLabel("lbl14"),
      value: summary.awarded || 0,
      subtitle: getLabel("lbl18"),
      iconColor: Labels.primary,
      icon: <EmojiEventsIcon />,
      statusId: 6,
      bgColor: "#fab01b1a",
      indicatorColor: "#CF7729",
      position:"end",
    },
    {
      title: getLabel("lbl12"),
      value: summary.active || 0,
      subtitle: getLabel("lbl16"),
      iconColor: Labels.primary,
      icon: <AssignmentIcon />,
      statusId: 1,
      bgColor: "#fab01b1a",
      indicatorColor: "#CF7729",
      position:"end",
    },
    {
      title: getLabel("lbl15"),
      value: summary.completed || 0,
      subtitle: getLabel("lbl18"),
      iconColor: Labels.primary,
      icon: <TaskAltIcon />,
      statusId: 24,
      bgColor: "#fab01b1a",
      indicatorColor: "#00916B",
      position:"start",
    },
  ];

  const layout = [
    { id: 'col-1', cards: cardData.slice(0, 1) }, // Card A
    { id: 'col-2', cards: cardData.slice(1, 3) }, // Cards B & C
    { id: 'col-3', cards: cardData.slice(3, 4) }, // Card D
  ];

  

   

  const chartOptions = [
    {value: "line", icon: <ShowChartIcon fontSize="large"  /> },
    {value: "bar", icon: <BarChartIcon fontSize="large" /> },
    {value: "pie", icon: <PieChartIcon fontSize="large" /> }
  ];

  // Map chartType string to component
  const chartComponents = {
    line: PLineChart,
    bar: PBarChart,
    pie: PPieChart
  };

  const SelectedChart = chartComponents[formData.chartType];

  const userList = [
    { value: 1, label: "demo sg" },
    { value: 2, label: "Eddie Seah" },
    { value: 3, label: "huikeng tan" }
  ]


  const iconStyle = {
    border: "1px solid #2D2F75",
    color: "#2D2F75",
    width:"50px",
    height:"50px",
    "&:hover": { bgcolor: "#2D2F75", color:"#fff",border: "1px solid #2D2F75" }
  };

  const handleOnClick = (payload) => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === payload.id ? "" : Number(payload.id)
    }));
  };

  const handleFilter = (statusId) => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === statusId ? "" : Number(statusId),
    }));
  };
  const data = useMemo(() => {
    let result = [...rows]; // copy original rows

    // status filter
    if (isNotEmpty(formData.status)) {
      const status = Number(formData.status);
      result = result.filter((item) => status === 6 ? item.jobStatusID >= 6 && item.jobStatusID !== 24 : item.jobStatusID === status);
    }

    // country filter
    if (isNotEmpty(formData.country)) {
      result = result.filter(
        (item) => item.countryID === Number(formData.country)
      );
    }

    // user filter
    if (isNotEmpty(formData.user)) {
      result = result.filter(
        (item) => item.userID === Number(formData.user)
      );
    }


    const parse = d => new Date(...(d.includes("/") ? d.split("/") : d.split("-")).reverse().map((v, i) => i === 1 ? v - 1 : +v));
    // Date Filter
    if (filter && isNotEmpty(formData.startDate) && isNotEmpty(formData.endDate)) {
      result = result.filter(item => {
        const req = parse(item.requestedDate);
        const start = parse(formData.startDate);
        const end = parse(formData.endDate);
        end.setHours(23, 59, 59, 999);
        return req >= start && req <= end;
      });
    }
    // search filter
    if (formData.search?.trim()) {
      const search = formData.search.toLowerCase();
      result = result.filter((item) =>
        item.enquiryId?.toLowerCase().includes(search) ||
        item.projectName?.toLowerCase().includes(search) ||
        item.projectNumber?.toLowerCase().includes(search)
      );
    }
    return result;

  }, [rows, formData, filter]);

  const handleReset = () => {
    setErrors((prev) => ({
      ...prev,
      startDate: "",
      endDate: ""
    }));

    setFormData((prev) => ({
      ...prev,
      startDate: "",
      endDate: "",
      //country: "",
      user: "",
      search: "",
      status: ""
    }));

    setChartData(chartOrginalData);
  };

  const handleExport = () => {
    // Format data for export
    const exportData = rows.map((item) => ({
      "Enquiry ID": item.enquiryId,
      "Project Name": item.projectName,
      "Project Number": item.projectNumber,
      "Status": item.jobStatusName,
      "Country": item.countryName,
      "User": item.userName,
    }));
    exportToExcel(exportData, Labels.reportName.enquiryReport);
  };

  const handleOpenChoose = () => {
    setOpenFilter(true);
  };

  const handleCloseChoose = () => {
    setOpenFilter(false);
    setErrors((prev) => ({
      ...prev,
      startDate: "",
      endDate: ""
    }));

    setFormData((prev) => ({
      ...prev,
      startDate: "",
      endDate: "",
      user: "",
      search: "",
      status: ""
    }));
    setChartData(chartOrginalData);
  };

  const handleSendChoose = () => {
    const isValid = FliterValidation();
    if (isValid) {
      setFilter(true);
      setOpenFilter(false);
    }
  };
  const FliterValidation = () => {
    const requiredFields = [
      Labels.dashboard.startDate,
      Labels.dashboard.endDate
    ];
    let newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = Labels.commonLabel.required;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  const handleRedirect = () => {
    navigate(labelRoutes.clientInfo);
  };
  // const Iconexport = () => (
  //   <img
  //     src={Icon_export}
  //     alt=""
  //     style={{ width: 22, height: 28 }}
  //   />
  // );
  const icons = [
    { icon: <AddTaskRoundedIcon color="green" />, tooltip: getLabel("lbl19"), action: handleRedirect },
    { icon: <ImportExportOutlinedIcon fontSize="large" />, tooltip: "Export", action: handleExport },
    { icon: <CalendarTodayOutlinedIcon fontSize="medium" />, tooltip: "Date Range Filter", action: handleOpenChoose },
    { icon: <span className="resetlabel">Reset filter</span>, tooltip: "",action: handleReset,noHover: true },
  ];

  const stepRoutes = {
    //1: labelRoutes.clientInfo,
    1: labelRoutes.enquiryDetails,
    2: labelRoutes.lineItems,
    3: labelRoutes.suppliers,
    4: labelRoutes.review,
  }

  const handleRoute = (row) => {
    const route = row.status === "Draft" ? (stepRoutes[row.stepID]) : labelRoutes.projectEnquiry;
    navigate(route, { state: { id: row.id } });
  }
  const lgSizes = [4, 5, 3];

  return (
    <div className="eqdashboard">
        <Box sx={{py: 3 }}>
          <PGrid item xs={12} sm={6} md={7} style={{paddingBottom:"30px"}}>
              <PTypography
                labelText={`${getLabel("lbl03")}`}
                weight={FontWeight.regular}
                flag={"big"}
                style={{ fontFamily: "'Montserrat', Tahoma, Geneva, Verdana, sans-serif", }}
              />
          </PGrid>
          {/* Welcome Back, demouser.sg <PGrid container className={Labels.margin.mb3}>
            <PGrid item xs={12} sm={6} md={7}>
              <PTypography
                labelText={`${getLabel("lbl08")}, ${localStorage.getItem("user")}`}
                weight={FontWeight.bold}
                flag={Labels.fontFlags.subHeader}
                color={CommonColors.red}
                style={{ fontFamily: "'Montserrat', Tahoma, Geneva, Verdana, sans-serif" }}
              />
            </PGrid>
          </PGrid> */}

          <PGrid container className={`eqdashboard-wrapper ${Labels.margin.mb3}`}>
            
            {loading ? (
              cardData.map((card, index) => (
                <PGrid key={index} item xs={12} sm={6} md={4} lg={lgSizes[index]}>
                  <Skeleton
                    variant="rectangular"
                    height={100}
                    sx={{ borderRadius: 0, }}
                  />
                </PGrid>
              ))
            ) : (
              // cardData.map((card, index) => (
              //   <PGrid key={index} item xs={12} sm={6} md={3} lg={3}>
              //     <PDashboardCard {...{ ...card}} onClick={() => handleFilter(card.statusId)} />
              //   </PGrid>
              // ))
              
              layout.map((col, index) => (
                  <PGrid key={col.id} item xs={12} sm={6} md={4} lg={lgSizes[index]} 
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px'}}>
                      {col.cards.map((card) => (
                        <PDashboardCard {...{ ...card}} onClick={() => handleFilter(card.statusId)} />
                      ))}
                    </div>
                  </PGrid>
                ))
            )}
          </PGrid>
          
          <PGrid container spacing={2} className={Labels.margin.mb3} style={{ display: "flex", alignItems: "stretch", paddingTop:"2rem" }}>
              <PGrid item xs={12} sm={12} md={8} style={{ display: "flex",flexDirection:"column"  }}>
                  <PGrid item xs={12} sm={12} md={12}>
                    <PSearch width="100%" placeholder={"Seach by Enquiry ID, Project Number, Project Name"} onChange={(e) => setFormData({ ...formData, search: e.target.value })} value={formData.search} />
                  </PGrid>
              </PGrid>
          </PGrid>
          <PGrid container spacing={2} className={Labels.margin.mb3} style={{ display: "flex", alignItems: "stretch" }}>
            {/* Table Card Column */}
            <PGrid item xs={12} sm={6} md={8} style={{ display: "flex",flexDirection:"column"  }}>
                <PGrid container className={Labels.margin.mb3} spacing={0}>
                  
                  <PGrid item xs={12} sm={6} md={4}>
                   
                    <PDropdown
                      label={getLabel("lbl09")}
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      options={country}
                      width={Labels.fontSize.xxxxl}
                      flag={Labels.flag.auto}
                      readOnly={role === "Admin" ? false : true}
                      labelMode="inside"
                    />
                  </PGrid>
                  <PGrid item xs={12} sm={6} md={4}>
                    <PDropdown
                      label={getLabel("lbl10")}
                      value={formData.user}
                      onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                      options={userList}
                      width={Labels.fontSize.xxxxl}
                      flag={Labels.flag.auto}
                      labelMode="inside"
                    />
                  </PGrid>
                  <PGrid item xs={12} sm={6} md={4} style={{display:"flex"}}>
                    <Box sx={{ display: "flex", alignItems: "center",  gap: 1 }}>
                      {icons.slice(1).map((item, index) => (
                        <Tooltip title={item.tooltip} arrow key={index}>
                          <span>
                            <IconButton
                              sx={{
                                ...iconStyle,
                                ...(item.noHover && {
                                  border: "0px solid #fff",
                                  width:"auto",
                                  height:"auto",
                                  "&:hover": {
                                    backgroundColor: "transparent",
                                  },
                                }),
                              }}
                              onClick={item.action}
                              disabled={loading}
                            >
                              {item.icon}
                            </IconButton>
                          </span>
                        </Tooltip>
                      ))}
                    </Box>
                  </PGrid>
                </PGrid>

                
            </PGrid>

            {/* Chart Card Column */}
            <PGrid item xs={12} sm={6} md={4} style={{ display: "flex", flexDirection:"column" }}>
                <div style={{ display: "flex", justifyContent: "center", }} >
                  <PToggleCircle
                    options={chartOptions}
                    value={formData.chartType}
                    onChange={(value) => setFormData((prev) => ({ ...prev, chartType: value }))}
                    disabled={loading}
                  />
                </div>
            </PGrid>
          </PGrid>
          <PGrid container spacing={2} className={Labels.margin.mb3} style={{ display: "flex", alignItems: "stretch" }}>
              <PGrid item xs={12} sm={6} md={8} style={{ display: "flex",flexDirection:"column"  }}>
                {/* flexGrow ensures the table area fills the card height */}
                <div style={{ flexGrow: 1 }}>
                  {loading ? (
                    <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                  ) : (
                    <PTable
                      columns={columns}
                      rows={data}
                      onClick={(row) => { handleRoute(row) }}
                    />
                  )}
                </div>
              </PGrid>
              <PGrid item xs={12} sm={6} md={4} style={{ display: "flex", flexDirection:"column" }}>
                <div style={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {loading ? (
                    <Skeleton variant="rectangular" height={350} width="100%" sx={{ borderRadius: 2 }} />
                  ) : (
                    SelectedChart && chartData.length > 0 && (
                      <SelectedChart data={chartData} onSliceClick={handleOnClick} />
                    )
                  )}
                </div>
              </PGrid>
          </PGrid>
        </Box >
      <PDialog
        open={openFilter}
        onClose={handleCloseChoose}
        title={"Date Range"}
        showCloseIcon={true}
        actions={
          <>
            <PButton
              fullWidth
              label={getLabel("lbl123")}
              variant="outlined"
              onClick={handleReset}
            />
            <PButton
              fullWidth
              label={<span className="text">{getLabel("lbl40")}</span>}
              variant={Labels.contained}
              onClick={handleSendChoose}
              startIcon={
                <img
                  src={arrow}
                  alt="arrow"
                  className="icon"
                />
              }
            />
          </>
        }
      >
        <PGrid>
          <PGrid item xs={12} sm={12} md={12} lg={12}>
            <PDatepicker
              name={Labels.dashboard.startDate}
              label={getLabel("lbl120")}
              value={formData.startDate}
              onChange={handleChange}
              width={100}
              helperText={errors?.startDate}
              maxDate={formData.endDate}
            />
          </PGrid>
          <PGrid item xs={12} sm={12} md={12} lg={12}>
            <PDatepicker
              name={Labels.dashboard.endDate}
              label={getLabel("lbl121")}
              value={formData.endDate}
              onChange={handleChange}
              width={100}
              helperText={errors?.endDate}
              minDate={formData.startDate}
            />
          </PGrid>
        </PGrid>
      </PDialog>
    </div>
  );
};

export default EqDashboard;
