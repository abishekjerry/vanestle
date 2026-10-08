import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import PGrid from "../PGrid/PGrid";
import PTextField from "../PTextField/PTextField";
import PDatepicker from "../PDatepicker/PDatepicker";
import { formatDate, parseDate, toast } from "../../utils/commonFunction/common";
import { Labels } from "../../utils/constants/labels";
import { EnquiryDetails_API } from "../../utils/api/apiUrl";
import { PostApi } from "../../utils/api/networking";

function PSlaTemplate({ sla, enquiryId, quoteStartDate, disabled = false, onChange, getLabel, response }) {
    const keys = ["quote", "proof", "production", "filecopies", "invoice"];
    const today = formatDate(new Date());
    const [loading, setLoading] = useState(false);
    const [phaseDates, setPhaseDates] = useState([]);

    const calculatePlanByQuote = (selectedDate, updatedPhases = null, startIndex = 0, res = false) => {
        const data = updatedPhases || phaseDates;
        const updated = [...data];

        let startDate = startIndex === 0 ? parseDate(selectedDate)
            : parseDate(updated[startIndex].startDate);

        while (startDate.getDay() === 0 || startDate.getDay() === 6) {
            startDate.setDate(startDate.getDate() + 1);
        }

        for (let i = startIndex; i < updated.length; i++) {
            if (i !== startIndex) {
                startDate = parseDate(updated[i - 1].endDate);
            }
            const tempStart = new Date(startDate);
            const endDate = new Date(tempStart);
            const days = Number(updated[i].mdays || updated[i].days);
            let count = 0;
            while (count < days) {
                endDate.setDate(endDate.getDate() + 1);

                if (endDate.getDay() !== 0 && endDate.getDay() !== 6) {
                    count++;
                }
            }
            const key = keys[i];
            const apiStartDate = response?.[`${key}startdate`];
            const apiEndDate = response?.[`${key}enddate`];

            if (res && apiStartDate?.trim() && apiEndDate?.trim()) {
                updated[i] = {
                    ...updated[i],
                    startDate: apiStartDate,
                    endDate: apiEndDate
                };
            } else {
                updated[i] = {
                    ...updated[i],
                    startDate: formatDate(tempStart),
                    endDate: formatDate(endDate)
                };
            }
            startDate = parseDate(updated[i].endDate);
        }
        setPhaseDates(updated);
        const dynamicData = updated.reduce((acc, item, i) => {
            const key = keys[i];
            acc[`${key}startdate`] = item.startDate;
            acc[`${key}enddate`] = item.endDate;
            acc[`modified${key.charAt(0).toUpperCase() + key.slice(1)}`] = item.mdays;
            return acc;
        }, {});
        onChange?.(dynamicData);
    };

    const handleModifiedDays = (index, value) => {
        if (value === "") {
            const updated = [...phaseDates];
            updated[index] = { ...updated[index], mdays: "" };
            setPhaseDates(updated);
            return;
        }
        const num = Number(value);
        if (isNaN(num) || num <= 0) return;
        const updated = [...phaseDates];
        updated[index] = { ...updated[index], mdays: value };
        calculatePlanByQuote(updated[0]?.startDate || today, updated, index, false);
    };

    const handleStartDateChange = (index, selectedDate) => {
        const updated = [...phaseDates];
        if (index > 0 && parseDate(selectedDate) < parseDate(updated[index - 1].endDate)) {
            return;
        }
        updated[index] = {
            ...updated[index],
            startDate: selectedDate
        };
        calculatePlanByQuote(updated[0]?.startDate || today, updated, index, false);
    };

    const slaTemplate = async (slaId) => {
        try {
            setLoading(true);
            const response = await PostApi(EnquiryDetails_API.GetSlatemplateMaster, {
                SlaId: slaId,
                Enqid: enquiryId
            }
            );
            const phases = [
                { name: getLabel("lbl54"), days: response?.defQuote, mdays: response?.quote },
                { name: getLabel("lbl55"), days: response?.defProof, mdays: response?.proof },
                { name: getLabel("lbl56"), days: response?.defProduction, mdays: response?.production },
                { name: getLabel("lbl57"), days: response?.defFileCopies, mdays: response?.fileCopies },
                { name: getLabel("lbl58"), days: response?.defInvoices, mdays: response?.invoicing }
            ];
            calculatePlanByQuote(quoteStartDate ? quoteStartDate : today, phases, 0, true);
        }
        catch (error) {
            toast(Labels.status.failure, Labels.message.somethingWentWrong);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!sla || !response || Object.keys(response).length === 0) return;
        slaTemplate(sla);
    }, [sla, response]);

    return (
        <>
            <PGrid container className="fw-semibold mb-4">
                <PGrid item md={2} >{getLabel("lbl50")}</PGrid>
                <PGrid item md={2}>{getLabel("lbl51")}</PGrid>
                <PGrid item md={2}>{getLabel("lbl140")}</PGrid>
                <PGrid item md={3} >{getLabel("lbl52")}</PGrid>
                <PGrid item md={3} >{getLabel("lbl53")}</PGrid>
            </PGrid>

            {phaseDates.map((phase, index) => (
                <PGrid container className="mb-1 align-items-center" key={index}>
                    <PGrid item md={2} className="mb-3">
                        {phase.name}
                    </PGrid>
                    <PGrid item md={2} className="mb-3">
                        {phase.days}
                    </PGrid>

                    <PGrid item md={2}>
                        <PTextField
                            width={50}
                            value={phase.mdays}
                            disabled={disabled}
                            onChange={(e) => handleModifiedDays(index, e.target.value)}
                            inputProps={{style: { textAlign: "center" }}}
                            sx={{ mb: 2 }}
                        />  
                    </PGrid>

                    <PGrid item md={3}>
                        <PDatepicker
                            width={100}
                            value={phase.startDate}
                            disabled={disabled}
                            minDate={index === 0 ? parseDate(today) : parseDate(phaseDates[index - 1]?.endDate)}
                            allowFuture={true}
                            onChange={(e) => {
                                const selectedDate = e?.target?.value
                                    ? e.target.value
                                    : formatDate(e);
                                if (index === 0) {
                                    calculatePlanByQuote(selectedDate, phaseDates, 0, false);
                                } else {
                                    handleStartDateChange(index, selectedDate);
                                }
                            }}
                        />
                    </PGrid>

                    <PGrid item md={3}>
                        <PTextField
                            value={phase.endDate}
                            disabled
                        />
                    </PGrid>
                </PGrid>
            ))}
        </>
    )
}
export default PSlaTemplate;