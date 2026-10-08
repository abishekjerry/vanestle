import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { Box, IconButton, Tooltip, Skeleton } from "@mui/material";
import PDropdown from "../../component/PDropdown/PDropdown";
import PDatepicker from "../../component/PDatepicker/PDatepicker";
import PDashboardCard from "../../component/PDashboardCard/PDashboardCard";
import PTable from "../../component/PTable/PTable";
import { Labels } from "../../utils/constants/labels";
import PButton from "../../component/PButton/PButton";
import PTypography from "../../component/PTypography/PTypography";
import PGrid from "../../component/PGrid/PGrid";
import ShowChartIcon from "@mui/icons-material/ShowChart"
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import PToggleCircle from "../../component/PToggle/PToggleCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import PSearch from "../../component/PSearch/PSearch";
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import CheckCircleIcon from '@mui/icons-material/TaskAlt';
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import { FontWeight } from '../../utils/constants/fonts'
import { useLanguage } from "../../utils/constants/language";
import { Account_API, Dashboard_API } from "../../utils/api/apiUrl";
import { PostApi } from "../../utils/api/networking";
import { exportToExcel, isNotEmpty, isSuccess } from "../../utils/commonFunction/common";
import { useNavigate } from "react-router-dom";
import { labelRoutes } from "../../navigations/labelRoutes";
import PDialog from "../../component/PDialog/PDialog";
import "./eqDashboard.css";
import arrow from "../../utils/assets/images/arrow_white.svg";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PauseIcon from "@mui/icons-material/Pause";
import SettingsInputAntennaIcon from "@mui/icons-material/SettingsInputAntenna";
import PrintIcon from "@mui/icons-material/Print";
import OutboxOutlinedIcon from "@mui/icons-material/OutboxOutlined";
import MoveToInboxOutlinedIcon from "@mui/icons-material/MoveToInboxOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import { userDetails } from "../../redux/actionType/actionType";
import { useDispatch, useSelector } from "react-redux";
const EqDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getLabel } = useLanguage();
  const [openFilter, setOpenFilter] = useState("");
  const [filter, setFilter] = useState(false);
  const [rows, setRows] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [chartOrginalData, setChartOrginalData] = useState([]);
  const { countryID, role, userName, userType, menuId, userID } = useSelector((state) => state.userDetails.user);
  const [formData, setFormData] = useState({
    country: "",
    user: "",
    startDate: "",
    endDate: "",
    search: "",
    chartType: "pie",
    status: "",
  });

  const [formDataList, setFormDataList] = useState({
    country: [],
    user: [],
  });
  const [errors, setErrors] = useState({
    startDate: "",
    endDate: "",
  })


  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await PostApi(Dashboard_API.Master, {
        userCountryId: countryID,
        role: role,
        userId: userID
      });
      setFormDataList({
        country: response.country,
        user: response.user
      });
      setFormData({
        ...formData,
        country: role === Labels.role.admin ? 0 : countryID
      })
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
        username: userName,
        menuId: menuId
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
      toast(Labels.status.failure, Labels.message.somethingWentWrong);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [menuId]);

  const columns = [
    { field: "enquiryId", header: "Enquiry ID" },
    { field: "projectNumber", header: "Project Number" },
    { field: "projectName", header: "Project Name" },
    { field: "requestedDate", header: "Requested Date" },
    { field: "status", header: "Status" },
    { field: "surveyStatus", header: "Survey Status" },
  ];

  const agencyCards = {
    1: [
      {
        title: getLabel("lbl13"),
        value: summary.approval || 0,
        subtitle: getLabel("lbl17"),
        iconColor: Labels.primary,
        icon: <PendingActionsIcon />,
        statusId: 3,
        bgColor: "#FAB01B",
        indicatorColor: "#ED3B25",
        position: "start",
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
        position: "end",
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
        position: "end",
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
        position: "start",
      },
      // {
      //   fileName: true,
      // },
    ],

    2: [
      {
        title: getLabel("lbl205"),
        value: 0,
        subtitle: getLabel("lbl216"),
        iconColor: Labels.primary,
        icon: <PauseIcon />,
        statusId: 3,
        bgColor: "#FAB01B",
        indicatorColor: "#ED3B25",
        position: "start",
      },
      {
        title: getLabel("lbl204"),
        value: 0,
        subtitle: getLabel("lbl215"),
        iconColor: Labels.primary,
        icon: <SettingsInputAntennaIcon />,
        statusId: 1,
        bgColor: "#fab01b1a",
        indicatorColor: "#CF7729",
        position: "end",
      },
      {
        title: getLabel("lbl206"),
        value: 0,
        subtitle: getLabel("lbl217"),
        iconColor: Labels.primary,
        icon: <PrintIcon />,
        statusId: 6,
        bgColor: "#fab01b1a",
        indicatorColor: "#CF7729",
        position: "end",
      },
    ],

    3: [
      {
        title: getLabel("lbl13"),
        value: summary.approval || 0,
        subtitle: getLabel("lbl17"),
        iconColor: Labels.primary,
        icon: <MoveToInboxOutlinedIcon />,
        statusId: 3,
        bgColor: "#FAB01B",
        indicatorColor: "#ED3B25",
        position: "start",
      },
      {
        title: getLabel("lbl12"),
        value: summary.active || 0,
        subtitle: getLabel("lbl16"),
        iconColor: Labels.primary,
        icon: <OutboxOutlinedIcon />,
        statusId: 1,
        bgColor: "#fab01b1a",
        indicatorColor: "#CF7729",
        position: "end",
      },
      {
        title: getLabel("lbl14"),
        value: summary.awarded || 0,
        subtitle: getLabel("lbl18"),
        iconColor: Labels.primary,
        icon: <PrintOutlinedIcon />,
        statusId: 6,
        bgColor: "#fab01b1a",
        indicatorColor: "#CF7729",
        position: "end",
      },
    ],
  };

  const supplierCards = [
    {
      title: getLabel("lbl220"),
      value: summary.quoteproposed || 0,
      subtitle: getLabel("lbl219"),
      iconColor: Labels.primary,
      icon: <LocalOfferIcon />,
      statusId: 3,
      bgColor: "#FAB01B",
      indicatorColor: "#ED3B25",
      position: "start",
    },
    {
      title: getLabel("lbl220"),
      value: summary.newrfq || 0,
      subtitle: getLabel("lbl218"),
      iconColor: Labels.primary,
      icon: <MoveToInboxIcon />,
      statusId: 24,
      bgColor: "#fab01b1a",
      indicatorColor: "#CF7729",
      position: "end",
    },
    {
      title: getLabel("lbl220"),
      value: summary.invites || 0,
      subtitle: getLabel("lbl220"),
      iconColor: Labels.primary,
      icon: <Inventory2Icon />,
      statusId: 6,
      bgColor: "#fab01b1a",
      indicatorColor: "#CF7729",
      position: "end",
    },
  ];

  const clientCards = [
    {
      title: getLabel("lbl13"),
      value: summary.forapproval || 0,
      subtitle: getLabel("lbl17"),
      iconColor: Labels.primary,
      icon: <EditIcon />,
      statusId: 3,
      bgColor: "#FAB01B",
      indicatorColor: "#ED3B25",
      position: "start",
    },
    {
      title: getLabel("lbl210"),
      value: summary.artwork || 0,
      subtitle: getLabel("lbl213"),
      iconColor: Labels.primary,
      icon: <ImageIcon />,
      statusId: 24,
      bgColor: "#fab01b1a",
      indicatorColor: "#CF7729",
      position: "end",
    },
    {
      title: getLabel("lbl211"),
      value: summary.proof || 0,
      subtitle: getLabel("lbl214"),
      iconColor: Labels.primary,
      icon: <VisibilityIcon />,
      statusId: 24,
      bgColor: "#fab01b1a",
      indicatorColor: "#CF7729",
      position: "end",
    },
    {
      title: getLabel("lbl212"),
      value: summary.production || 0,
      subtitle: getLabel("lbl221"),
      iconColor: Labels.primary,
      icon: <HourglassEmptyIcon />,
      statusId: 24,
      bgColor: "#fab01b1a",
      indicatorColor: "#CF7729",
      position: "end",
    },
    {
      title: getLabel("lbl15"),
      value: summary.completed || 0,
      subtitle: getLabel("lbl222"),
      iconColor: Labels.primary,
      icon: <AssignmentTurnedInIcon />,
      statusId: 24,
      bgColor: "#fab01b1a",
      indicatorColor: "#00916B",
      position: "start",
    },
  ];

  const cardData = [
    ...(userType?.toLowerCase() === Labels.userType.agency
      ? agencyCards[menuId] || []
      : userType?.toLowerCase() === Labels.userType.supplier
        ? supplierCards
        : userType?.toLowerCase() === Labels.userType.client
          ? clientCards
          : []),
  ];

  const layout = [
    { id: 'col-1', cards: cardData.slice(0, 1) }, // Card A
    { id: 'col-2', cards: cardData.slice(1, 3) }, // Cards B & C
    { id: 'col-3', cards: cardData.slice(3, 4) }, // Card D
  ];

  const chartOptions = [
    { value: "line", icon: <ShowChartIcon fontSize="small" /> },
    { value: "bar", icon: <BarChartIcon fontSize="small" /> },
    { value: "pie", icon: <PieChartIcon fontSize="small" /> }
  ];

  // Map chartType string to component
  const chartComponents = {
    line: lazy(() => import("../../component/PChart/PLineChart")),
    bar: lazy(() => import("../../component/PChart/PBarChart")),
    pie: lazy(() => import("../../component/PChart/PPieChart")),
  };

  const SelectedChart = chartComponents[formData.chartType];

  const iconStyle = {
    border: "1px solid #2D2F75",
    color: "#2D2F75",
    width: "50px",
    height: "50px",
    "&:hover": { bgcolor: "#2D2F75", color: "#fff", border: "1px solid #2D2F75" }
  };

  const handleOnClick = (payload) => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === payload.id ? "" : Number(payload.id)
    }));
  };

  const handleFilter = (statusId) => {
    const id = Number(statusId);
    setFormData((prev) => ({
      ...prev,
      status: prev.status === id ? "" : id,
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
    menuId === 3 ? window.open(Account_API.Echo, "_blank") : navigate(labelRoutes.clientInfo);
  };
  // const Iconexport = () => (
  //   <img
  const eProcurement = {
    1: getLabel("lbl19"),
    2: getLabel("lbl223"),
    3: getLabel("lbl224"),
  }[menuId];

  const icons = [
    { icon: <AddTaskRoundedIcon color="green" />, tooltip: eProcurement, action: handleRedirect },
    { icon: <ImportExportOutlinedIcon fontSize="large" />, tooltip: "Export", action: handleExport },
    { icon: <CalendarTodayOutlinedIcon fontSize="medium" />, tooltip: "Date Range Filter", action: handleOpenChoose },
    { icon: <span className="resetlabel">Reset filter</span>, tooltip: "", action: handleReset, noHover: true },

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
    dispatch({
      type: userDetails,
      payload: {
        enquiryId: row.enquiryId,
      },
    });
    navigate(route, { state: { id: row.id } });
  }
  const lgSizes = [4, 5, 3];
  const mdSizes = [6, 6, 12];

  return (
    <div className="eqdashboard">
      <Box sx={{ py: 3 }}>
        <PGrid item xs={12} sm={6} md={7} style={{ paddingBottom: "30px" }}>
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

        <PGrid container className={`eqdashboard-wrapper ${Labels.margin.mb5}`}>

          {loading ? (
            cardData.map((card, index) => (
              <PGrid
                key={`skeleton-${index}`}
                item
                xs={12}
                md={4}
                lg={lgSizes[index]}
              >
                <Skeleton
                  variant="rectangular"
                  height={100}
                  sx={{ borderRadius: 0 }}
                />
              </PGrid>
            ))
          ) : (
            layout.map((col, index) => (
              <PGrid
                key={col.id}
                item
                xs={12}
                md={mdSizes[index]}
                lg={lgSizes[index]}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    gap: "16px",
                  }}
                >
                  {col.cards.map((card, cardIndex) => (
                    <PDashboardCard
                      key={`${col.id}-${cardIndex}`}
                      {...card}
                      onClick={() => handleFilter(card.statusId)}
                    />
                  ))}
                </div>
              </PGrid>
            ))
          )}
        </PGrid>

        <PGrid container spacing={2} className={Labels.margin.mb3} style={{ display: "flex", alignItems: "stretch" }}>
          <PGrid item xs={12} lg={8} xl={9} style={{ display: "flex", flexDirection: "column" }}>
            <PGrid className={Labels.margin.mb3}>
              <PSearch width="100%" placeholder={"Seach by Enquiry ID, Project Number, Project Name"} onChange={(e) => setFormData({ ...formData, search: e.target.value })} value={formData.search} />
            </PGrid>

            <PGrid container className={Labels.margin.mb3} spacing={0}>
              <PGrid item xs={12} sm={6} md={4}>
                <PDropdown
                  label={getLabel("lbl09")}
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  options={formDataList.country}
                  width={Labels.fontSize.xxxxl}
                  flag={Labels.flag.auto}
                  readOnly={role === Labels.role.admin ? false : true}
                  labelMode="inside"
                />
              </PGrid>
              <PGrid item xs={12} sm={6} md={4}>
                <PDropdown
                  label={getLabel("lbl10")}
                  value={formData.user}
                  onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                  options={formDataList.user}
                  width={Labels.fontSize.xxxxl}
                  flag={Labels.flag.auto}
                  labelMode="inside"
                />
              </PGrid>
              <PGrid item xs={12} sm={6} md={4} style={{ display: "flex" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {icons.slice(1).map((item, index) => (
                    <Tooltip title={item.tooltip} arrow key={index}>
                      <span>
                        <IconButton
                          sx={{
                            ...iconStyle,
                            ...(item.noHover && {
                              border: "0px solid #fff",
                              width: "auto",
                              height: "auto",
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

            <PGrid>
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

          </PGrid>

          <PGrid item xs={12} lg={4} xl={3} style={{ display: "flex", flexDirection: "column" }} className="p-0">
            <div style={{ display: "flex", paddingLeft: "20px", paddingBottom: "20px" }} >
              <PToggleCircle
                options={chartOptions}
                value={formData.chartType}
                onChange={(value) => setFormData((prev) => ({ ...prev, chartType: value }))}
                disabled={loading}
              />
            </div>

            <Suspense>
              <div>
                {loading ? (
                  <Skeleton variant="rectangular" height={350} width="100%" sx={{ borderRadius: 2 }} />
                ) : (
                  SelectedChart && chartData.length > 0 && (
                    <SelectedChart data={chartData} onSliceClick={handleOnClick} />
                  )
                )}
              </div>
            </Suspense>

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
              width={180}
            />
            <PButton
              fullWidth
              label={getLabel("lbl40")}
              variant={Labels.contained}
              onClick={handleSendChoose}
              width={180}
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
