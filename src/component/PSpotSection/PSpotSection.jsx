import { useState } from "react";
import { Box, Divider, Tooltip } from "@mui/material";
import PTable from "../PTable/PTable";
import PGrid from "../PGrid/PGrid";
import PTypography from "../PTypography/PTypography";
import { Labels } from "../../utils/constants/labels";
import { CommonColors } from "../../utils/constants/colors";
import { FontWeight } from "../../utils/constants/fonts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PButton from "../PButton/PButton";
import { useLanguage } from "../../utils/constants/language";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import arrow from "../../utils/assets/images/arrow_white.svg";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CompareOutlinedIcon from "@mui/icons-material/CompareOutlined";
import RuleOutlinedIcon from "@mui/icons-material/RuleOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PTextField from "../PTextField/PTextField";
import PDropdown from "../PDropdown/PDropdown";
import { getOptionValue } from "../../utils/commonFunction/common";
import PDialog from "../PDialog/PDialog";
const PSpotSection = () => {
    const { getLabel } = useLanguage();
    //const [isOpen, setIsOpen] = useState(true);
    const [formData, setFormData] = useState({
        epdSpot: true,
        emmdSpot: true,
        factor: false,
        compare: false,
        openImpact: false,
        enImpact: false,
        reasons: false,
        id: "",
        materialUsed: "",
        type: "",
        weight: "",
        reason: ""
    });

    const [errors, setErrors] = useState({
        materialUsed: "",
        type: "",
        weight: "",
        reason: ""
    });

    const actionIconSx = {
        color: "#6b7280",
        cursor: "pointer",
        padding: "4px",
        borderRadius: "4px",
        transition: "all 0.2s ease",
        "&:hover": {
            color: "#374151",
            backgroundColor: "#f3f4f6"
        }
    };

    const handleEdit = (row) => {
        setFormData((prev) => ({
            ...prev,
            id: row.id,
        }));
    }

    const handleCancel = (e) => {
        e.stopPropagation();
        setFormData((prev) => ({
            ...prev,
            id: ""
        }));
    };

    const renderActions = (row) => {
        const flag = formData.id === row.id;
        return (
            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                {flag ? (
                    <>
                        <Tooltip title="Save" arrow>
                            <SaveOutlinedIcon sx={actionIconSx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSave(row);
                                }}
                            />
                        </Tooltip>

                        <Tooltip title="Cancel" arrow>
                            <CloseOutlinedIcon sx={actionIconSx}
                                onClick={handleCancel}
                            />
                        </Tooltip>
                    </>
                ) : (
                    <Tooltip title="Edit" arrow>
                        <EditOutlinedIcon sx={actionIconSx}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(row);
                            }}
                        />
                    </Tooltip>
                )}
            </div>
        );
    };

    const renderViewActions = (row) => {
        const flag = row.view;
        return (
            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                {flag ? (
                    <>
                        <Tooltip title="View" arrow>
                            <VisibilityOutlinedIcon sx={actionIconSx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFormData((prev) => ({
                                        ...prev,
                                        enImpact: true
                                    }));
                                }}
                            />
                        </Tooltip>
                    </>
                ) : (
                    <>
                        <Tooltip title="View" arrow>
                            <VisibilityOutlinedIcon sx={actionIconSx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFormData((prev) => ({
                                        ...prev,
                                        openImpact: true
                                    }));
                                }}
                            />
                        </Tooltip>
                        <Tooltip title="Compare" arrow>
                            <CompareOutlinedIcon sx={actionIconSx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFormData((prev) => ({
                                        ...prev,
                                        compare: true
                                    }));
                                }}
                            />
                        </Tooltip>
                        <Tooltip title="Non-Compare" arrow>
                            <RuleOutlinedIcon sx={actionIconSx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFormData((prev) => ({
                                        ...prev,
                                        reasons: true
                                    }));
                                }}
                            />
                        </Tooltip>
                    </>
                )}

            </div >
        );
    };

    const handleRowChange = (id, field, value) => {
        setFormDataList((prev) => ({
            ...prev,
            packagingMaterial: prev.packagingMaterial.map((row) =>
                row.id === id ? { ...row, [field]: value } : row
            )
        }));
    };

    const handleChange = async (e) => {
        const { name } = e.target;
        let value = e.target.value;

        if (name === "weight") {
            value = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
        }
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const materialUsed = [
        { value: 1, label: "Cardboard" },
        { value: 2, label: "Plastic" },
        { value: 3, label: "Glass" },
        { value: 4, label: "Metal" }
    ];

    const typeMaterial = [
        { value: 1, label: "NA" },
    ];

    const unit = [{ value: 1, label: "Kilograms" },];

    const renderTextInputField = (field) => ({
        render: (row) => {
            if (formData.id !== row.id) {
                return row[field];
            }
            return (
                <PTextField
                    name={field}
                    value={row[field]}
                    onChange={(e) => handleRowChange(row.id, field, e.target.value.replace(/[^0-9.]/g, ""))}
                    width={100}
                    sx={{
                        "& .MuiInputBase-root": {
                            height: 40,
                            minHeight: 45
                        }
                    }}
                />
            )
        }
    });

    const renderDropdownField = (field, options) => ({
        render: (row) => {
            const value = getOptionValue(options, row[field]);
            if (formData.id !== row.id) {
                return row[field];
            }
            return (
                <PDropdown
                    name={field}
                    value={value}
                    options={options}
                    onChange={(e) => handleRowChange(row.id, field, e.target.value)}
                    width={100}
                    sx={{
                        "& .MuiInputBase-root": {
                            height: 40,
                            minHeight: 40
                        }
                    }}
                    disabled={true}
                />
            )
        }
    });

    const [formDataList, setFormDataList] = useState({
        packagingMaterial: [
            { id: 1, itemnumber: "001", materialUsed: "Cardboard", typeMaterial: "NA", weight: "10", unit: "Kilograms" },
            { id: 2, itemnumber: "002", materialUsed: "Plastic", typeMaterial: "NA", weight: "5", unit: "Kilograms" }
        ],
        data: [],

        mainMaterial: [{ field: "materialUsed", header: "Material Used" }, { field: "mainMaterial", header: "Main Material" },
        { field: "typeMaterial", header: "Type Material" }, { field: "weight", header: "Weight" },
        { field: "unit", header: "Unit" }, { field: "action", header: "Action" }],

        impactMaterial: [{ id: 1, itemNumber: "001", type: "Art Carton", embodiedCarbon: 953.000, totalEnergy: 0.880, waterUsage: 15.000, wood: 272.400 }],

        comparativeImpactMaterial: [{ id: 1, itemNumber: "001", type: "Poster Paper", embodiedCarbon: 129.000, totalEnergy: 0.278, waterUsage: 96.500, wood: 197.400, view: true }],

        totalMaterial: [{ field: "itemNumber", header: "Item Number" }, { field: "itemName", header: "Item Name" },
        { field: "embodiedCarbon", header: "Embodied Carbon" }, { field: "waterUsage", header: "Water Usage" },
        { field: "totalEnergy", header: "Total Energy" }, { field: "wood", header: "Wood" }, { field: "explanation", header: "Explanation" }],

        enviromantalImpactMaterial: [{ field: "type", header: "Type" }, { field: "embodiedCarbon", header: "Embodied Carbon" }, { field: "waterUsage", header: "Water Usage" },
        { field: "totalEnergy", header: "Total Energy" }, { field: "wood", header: "Wood" }, { field: "explanation", header: "Explanation" }],

        emissionFactors: [{ field: "country", header: "Country" }, { field: "emissionFactor", header: "EmissionFactor" }],
        emissionFactorsData: [{ country: "Australia", emissionFactor: 0.76 }, { country: "China", emissionFactor: 0.8953 },
        { country: "India", emissionFactor: 0.9405 }, { country: "Indonesia", emissionFactor: 0.811 },
        { country: "Japan", emissionFactor: 0.471 }, { country: "Malaysia", emissionFactor: 0.67 },
        { country: "New Zealand", emissionFactor: 0.12 }, { country: "Phillipines", emissionFactor: 0.7122 },
        { country: "Singapore", emissionFactor: 0.408 }, { country: "South Korea", emissionFactor: 0.625 }, { country: "Thailand", emissionFactor: 0.529 },
        { country: "Vietnam", emissionFactor: 0.9242 },]
    });
    const packagingMaterial = [
        { field: "itemnumber", header: "Item Number" }
        , { field: "materialUsed", header: "Material", ...renderDropdownField("materialUsed", materialUsed) }
        , { field: "typeMaterial", header: "Type", ...renderDropdownField("typeMaterial", typeMaterial) }
        , { field: "weight", header: "Weight", ...renderTextInputField("weight") }
        , { field: "unit", header: "Unit of Measurement", ...renderDropdownField("unit", unit) }
        , { field: "action", header: "Action", render: renderActions }
        //{ field: "packageMaterial", header: "Package Material" }
    ]

    const impactMaterial = [{ field: "itemNumber", header: "Item Number" }, { field: "type", header: "Type" },
    { field: "embodiedCarbon", header: "Embodied Carbon" }, { field: "waterUsage", header: "Water Usage" },
    { field: "totalEnergy", header: "Total Energy" }, { field: "wood", header: "Wood" }, { field: "explanation", header: "Explanation", render: renderViewActions }]

    const comparativeImpactMaterial = [{ field: "itemNumber", header: "Item Number" }, { field: "type", header: "Type" },
    { field: "embodiedCarbon", header: "Embodied Carbon" }, { field: "waterUsage", header: "Water Usage" },
    { field: "totalEnergy", header: "Total Energy" }, { field: "wood", header: "Wood" }, { field: "explanation", header: "Explanation", render: renderViewActions }
        //, { field: "itemName", header: "Item Name" },
    ]

    const environmentalImpact = [
        {
            heading: "Wood use",
            value: "Art Carton uses 272.400 Kg wood equivalent to 0 tree(s)"
        },
        {
            heading: "Total energy",
            value: "Art Carton uses 0.880 MWh of Energy equivalent to 2 residential refrigerators operated/year"
        },
        {
            heading: "Greenhouse gases/climate change impacts",
            value: "Art Carton emits 953.000 kg CO2 equivalent to emissions from 0 cars/year"
        },
        {
            heading: "Water consumption",
            value: "Art Carton uses 15.000 m3 of water equivalent to 0 olympic size swimming pool"
        }
    ]

    const comparativeEnvironmentalImpact = [
        {
            heading: "Wood use",
            content: [
                "Art Carton uses 272.400 Kg wood equivalent to 0 tree(s) of standard dimension (25m height and 0.3 m in Diameter)",
                "Poster Paper uses 197.400 Kg wood equivalent to 0 tree(s) of standard dimension (25m height and 0.3 m in Diameter)",
                "Art Carton uses 75.000 Kg more Wood, a difference of 0 tree(s) of standard dimension (25m height and 0.3 m in Diameter)"
            ]
        },
        {
            heading: "Total energy",
            content: [
                "Art Carton uses 0.880 MWh of Energy equivalent to energy used by 2 residential refrigerators operated/year",
                "Poster Paper uses 0.278 MWh of Energy equivalent to energy used by 1 residential refrigerators operated/year",
                "Art Carton uses 0.602 MWh more of Energy, a difference of 1 residential refrigerators operated/year"
            ]
        },
        {
            heading: "Greenhouse gases/climate change impacts",
            content: [
                "Art Carton uses 953.000 kg CO2 equivalent to emissions from 0 cars/year",
                "Poster Paper uses 129.000 kg CO2 equivalent to emissions from 0 cars/year",
                "Art Carton uses 824.000 kg CO2 more, a difference of 0 cars/year"
            ]
        },
        {
            heading: "Water consumption",
            content: [
                "Art Carton uses 15.000 m3 of water equivalent to 0 olympic size swimming pool",
                "Poster Paper uses 96.500 m3 of water equivalent to 0 olympic size swimming pool",
                "Art Carton uses 81.500 m3 less of Water, a difference of 0 olympic size swimming pool"
            ]
        }
    ]

    const getCompareColor = (text) => {
        if (text.toLowerCase().includes("more")) return CommonColors.red.main;
        if (text.toLowerCase().includes("less")) return CommonColors.green.main;
        return CommonColors.yellow.main;
    };
    return (
        <>
            <div className={Labels.margin.mb0}>
                <PGrid container className={Labels.margin.mb3}>
                    <PGrid item xs={12} sm={6} md={6}>
                        <PTypography
                            labelText={`${getLabel("lbl191")} ( ${getLabel("lbl190")} )`}
                            flag={Labels.fontFlags.header}
                            weight={FontWeight.regular}
                        />
                    </PGrid>
                </PGrid>
                <Divider sx={{ mb: 2 }} />
                <PGrid container className="d-flex justify-content-end align-items-center mb-0">
                    <PGrid item xs={12} sm={6} md={8}>
                        <PTypography
                            labelText={`${getLabel("lbl192")} ( ${getLabel("lbl190")} )`}
                            weight={FontWeight.bold}
                            flag={Labels.fontFlags.normalText}
                        />
                    </PGrid>

                    <PGrid item xs={12} sm={6} md={4} className="d-flex justify-content-end align-items-center mb-3" >
                        <IconButton onClick={() =>
                            setFormData((prev) => ({
                                ...prev,
                                epdSpot: !prev.epdSpot,
                            }))}
                        >
                            {formData.epdSpot ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </PGrid>
                </PGrid>
                {/* <Divider sx={{ mb: 2 }} /> */}
                <Collapse in={formData.epdSpot} timeout="auto" unmountOnExit>
                    <PGrid container className={Labels.margin.mb0} >
                        <PGrid item xs={12} sm={6} md={12}>
                            <PTable columns={packagingMaterial} rows={formDataList.packagingMaterial} showPagination={false} />
                        </PGrid>
                    </PGrid>
                </Collapse>

                <Divider sx={{ mb: 2 }} />
                <PGrid container className="d-flex justify-content-end align-items-center mb-3">
                    <PGrid item xs={12} sm={6} md={8}>
                        <PTypography
                            labelText={`${getLabel("lbl193")} ( ${getLabel("lbl190")} )`}
                            weight={FontWeight.bold}
                            flag={Labels.fontFlags.normalText}
                        />
                    </PGrid>

                    <PGrid item xs={12} sm={6} md={4} className="d-flex justify-content-end align-items-center">
                        <IconButton onClick={() =>
                            setFormData((prev) => ({
                                ...prev,
                                emmdSpot: !prev.emmdSpot,
                            }))}
                        >
                            {formData.emmdSpot ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </PGrid>
                </PGrid>
                {/* <Divider sx={{ mb: 2 }} /> */}
                <Collapse in={formData.emmdSpot} timeout="auto" unmountOnExit>
                    <PGrid container className={Labels.margin.mb4}>
                        <PGrid item xs={12} sm={6} md={12}>
                            <PTable columns={formDataList.mainMaterial} rows={formDataList.data} showPagination={false} />
                        </PGrid>
                    </PGrid>
                </Collapse>
            </div>
            <Divider sx={{ mb: 2 }} />
            <div className={Labels.margin.mb3}>
                <PGrid container className={Labels.margin.mb0}>
                    <PGrid item xs={12} sm={6} md={6}>
                        <PTypography
                            labelText={`${getLabel("lbl194")} ( ${getLabel("lbl197")} )`}
                            weight={FontWeight.bold}
                            flag={Labels.fontFlags.normalText}
                        />
                    </PGrid>
                    <PGrid item xs={12} sm={6} md={6} className="d-flex justify-content-end gap-2">
                        <PButton
                            label={getLabel("lbl189")}
                            variant="contained"
                            color={CommonColors.dark_blue}
                            onClick={() => setFormData((prev) => ({
                                ...prev,
                                factor: true,
                            }))}
                            width={280}
                            startIcon={<img src={arrow} alt="arrow" className="icon" />}
                        />
                    </PGrid>
                </PGrid>
                {/* <Divider sx={{ mb: 2 }} /> */}
                <PGrid container className={Labels.margin.mb4}>
                    <PGrid item xs={12} sm={6} md={12}>
                        <PTable columns={impactMaterial} rows={formDataList.impactMaterial} showPagination={false} />
                    </PGrid>
                </PGrid>
                <Divider sx={{ mb: 2 }} />
                <PGrid container className={Labels.margin.mb0}>
                    <PGrid item xs={12} sm={6} md={8}>
                        <PTypography
                            labelText={`${getLabel("lbl195")} ( ${getLabel("lbl197")} )`}
                            weight={FontWeight.bold}
                            flag={Labels.fontFlags.normalText}
                        />
                    </PGrid>
                </PGrid>

                <PGrid container className={Labels.margin.mb4}>
                    <PGrid item xs={12} sm={6} md={12}>
                        <PTable columns={comparativeImpactMaterial} rows={formDataList.comparativeImpactMaterial} showPagination={false} />
                    </PGrid>
                </PGrid>
                <Divider sx={{ mb: 2 }} />
                <PGrid container className={Labels.margin.mb0}>
                    <PGrid item xs={12} sm={6} md={8}>
                        <PTypography
                            labelText={`${getLabel("lbl196")} ( ${getLabel("lbl197")} )`}
                            weight={FontWeight.bold}
                            flag={Labels.fontFlags.normalText}
                        />
                    </PGrid>
                </PGrid>
                {/* <Divider sx={{ mb: 2 }} /> */}
                <PGrid container className={Labels.margin.mb4}>
                    <PGrid item xs={12} sm={6} md={12}>
                        <PTable columns={formDataList.totalMaterial} rows={formDataList.data} showPagination={false} />
                    </PGrid>
                </PGrid>
                <Divider sx={{ mb: 2 }} />
                <PGrid container className={Labels.margin.mb0}>
                    <PGrid item xs={12} sm={6} md={8}>
                        <PTypography
                            labelText={`${getLabel("lbl194")} ( ${getLabel("lbl198")} )`}
                            weight={FontWeight.bold}
                            flag={Labels.fontFlags.normalText}
                        />
                    </PGrid>
                </PGrid>
                {/* <Divider sx={{ mb: 2 }} /> */}
                <PGrid container className={Labels.margin.mb4}>
                    <PGrid item xs={12} sm={6} md={12}>
                        <PTable columns={formDataList.enviromantalImpactMaterial} rows={formDataList.data} showPagination={false} />
                    </PGrid>
                </PGrid>
                {/* factor dialog */}
                <PDialog
                    open={formData.factor}
                    onClose={() => setFormData((prev) => ({
                        ...prev,
                        factor: false,
                    }))}
                    title={`${getLabel("lbl194")} ${getLabel("lbl189")}`}
                    showCloseIcon={true}
                    maxWidth="sm"
                >
                    <PGrid container className={Labels.margin.mb4}>
                        <PGrid item xs={12} sm={12} md={12}>
                            <PTable columns={formDataList.emissionFactors} rows={formDataList.emissionFactorsData} showCheckbox={false} />
                        </PGrid>
                    </PGrid>
                </PDialog>

                {/* compare dialog */}
                <PDialog
                    open={formData.compare}
                    onClose={() => setFormData((prev) => ({
                        ...prev,
                        compare: false,
                    }))}
                    title={`${"Compare Environmental Impact"}`}
                    showCloseIcon={true}
                    maxWidth="sm"
                    actions={
                        < PGrid className="d-flex align-items-center justify-content-end gap-2" >
                            <PButton
                                fullWidth
                                label={getLabel("lbl125")}
                                variant="outlined"
                                onClick={() => setFormData((prev) => ({
                                    ...prev,
                                    compare: false
                                }))}
                                color={CommonColors.grey.main}
                                width={120}
                            />
                            <PButton
                                fullWidth
                                label={"Update"}
                                variant={Labels.contained}
                                //onClick={handleUpdate}
                                color={CommonColors.dark_blue}
                                width={200}
                                startIcon={<img src={arrow} alt="arrow" className="icon" />}
                            />
                        </PGrid >
                    }
                >
                    <PGrid container className={Labels.margin.mb4}>
                        <PGrid item xs={12} sm={12} md={12}>
                            <PDropdown
                                label={`${getLabel("lbl201")} ${Labels.symbols.required}`}
                                name={Labels.lineItems.materialUsed}
                                value={formData.materialUsed}
                                options={materialUsed}
                                onChange={handleChange}
                                width={100}
                                disabled={true}
                                helperText={errors?.materialUsed}
                                sx={{ mt: 3 }}
                                flag={Labels.flag.auto}
                            />
                            <PDropdown
                                label="Type *"
                                name={"type"}
                                value={formData.type}
                                options={typeMaterial}
                                onChange={handleChange}
                                width={100}
                                disabled={true}
                                helperText={errors?.type}
                                flag={Labels.flag.auto}
                                sx={{ mt: 3 }}
                            />
                            <PTextField
                                label="Weight *"
                                name={"weight"}
                                value={formData.weight}
                                onChange={handleChange}
                                //width={10}
                                helperText={errors?.weight}
                            />
                        </PGrid>
                    </PGrid>
                </PDialog>

                {/* Impact dialog */}
                <PDialog
                    open={formData.openImpact}
                    onClose={() => setFormData((prev) => ({
                        ...prev,
                        openImpact: false,
                    }))}
                    showCloseIcon={true}
                    title="Environmental Impact Explanation"
                    maxWidth="sm"
                >
                    {environmentalImpact.map((item, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <PTypography
                                labelText={item.heading}
                                weight={FontWeight.bold}
                                flag={Labels.fontFlags.errorLbl}
                                sx={{ mb: 0.5 }}
                            />
                            <PTypography
                                labelText={item.value}
                                flag={Labels.fontFlags.smallText}
                                color={CommonColors.grey.main}
                                weight={FontWeight.bold}
                            />
                        </Box>
                    ))}
                </PDialog>

                {/* enviromentImpact dialog */}
                <PDialog
                    open={formData.enImpact}
                    onClose={() => setFormData((prev) => ({
                        ...prev,
                        enImpact: false,
                    }))}
                    showCloseIcon={true}
                    title="Environmental Impact & Savings Summary"
                    maxWidth="sm"
                >
                    {comparativeEnvironmentalImpact.map((item, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <Box key={index} sx={{ mb: 0.5 }}>
                                <PTypography
                                    labelText={item.heading}
                                    weight={FontWeight.bold}
                                    flag={Labels.fontFlags.errorLbl}
                                    sx={{ mb: 0.5 }}
                                />
                            </Box>

                            {item.content.map((text, contentIndex) => (
                                <Box key={contentIndex} sx={{ mb: 0.5 }}>
                                    <PTypography
                                        labelText={text}
                                        flag={Labels.fontFlags.smallText}
                                        color={contentIndex === 2 ? getCompareColor(text) : CommonColors.grey.main}
                                        weight={FontWeight.bold}
                                        sx={{
                                            lineHeight: 1.8,
                                            fontStyle: contentIndex === item.content.length - 1 ? "italic" : "normal"
                                        }}
                                    />
                                </Box>
                            ))}

                        </Box>
                    ))}
                </PDialog>

                {/* reason dialog */}
                <PDialog
                    open={formData.reasons}
                    onClose={() => setFormData((prev) => ({
                        ...prev,
                        reasons: false,
                    }))}
                    title={`${"Reason to proceed without Alternate Material"}`}
                    showCloseIcon={true}
                    maxWidth="sm"
                    actions={
                        < PGrid className="d-flex align-items-center justify-content-end gap-2" >
                            <PButton
                                fullWidth
                                label={getLabel("lbl125")}
                                variant="outlined"
                                onClick={() => setFormData((prev) => ({
                                    ...prev,
                                    compare: false
                                }))}
                                color={CommonColors.grey.main}
                                width={120}
                            />
                            <PButton
                                fullWidth
                                label={"Update"}
                                variant={Labels.contained}
                                //onClick={handleUpdate}
                                color={CommonColors.green.main}
                                width={200}
                            />
                        </PGrid >
                    }
                >
                    <PGrid container className={Labels.margin.mb4}>
                        <PGrid item xs={12} sm={12} md={12}>
                            <PTextField
                                label="Reason *"
                                name={"reason"}
                                value={formData.reason}
                                onChange={handleChange}
                                helperText={errors?.reason}
                                multiline={true}
                                rows={4.5}
                            />
                        </PGrid>
                    </PGrid>
                </PDialog>
            </div>
        </>

    )
}

export default PSpotSection;