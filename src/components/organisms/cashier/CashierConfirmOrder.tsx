import { cashierButtonStyle, cashierIconButtonStyle } from "@/@types/styles";
import LineBreakAtom from "@/components/atom/LineBreakAtom";
import CashierOrderDetails from "@/components/organisms/cashier/CashierOrderDetails";
import { useAppStore } from "@/store";
import { Button, Modal, Box, ButtonBase, Radio } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { CiUser } from "react-icons/ci";
import { FiTrash2 } from "react-icons/fi";
import { GoClock } from "react-icons/go";
import { IoBackspaceOutline } from "react-icons/io5";
import moneys from "@/assets/icons/vuesax/outline/moneys.svg";
import cardPos from "@/assets/icons/vuesax/outline/card-pos.svg";
import { ICustomer } from "@/@types/interfaces/ICustomer";
import { InvoiceProductRow } from "@/@types/dto/InvoiceDto";
import { InvoiceStatusEnum } from "@/@types/interfaces/IInvoice";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";

interface ICashierConfirmOrderProps {
  isProductsLocked: boolean;
  paid: string;
  setPaid: Dispatch<SetStateAction<string>>;
  setRemainingAmount: (val: number) => void;
  customer: ICustomer | undefined;
  date: Date;
  details: InvoiceProductRow[];
  discountType: number;
  discountValue: number;
  onSubmit(invoiceStatusId?: InvoiceStatusEnum): Promise<void>;
}

export default function CashierConfirmOrder({
  isProductsLocked,
  paid,
  setPaid,
  setRemainingAmount,
  customer,
  date,
  details,
  discountType,
  discountValue,
  onSubmit,
}: Readonly<ICashierConfirmOrderProps>) {
  const { t } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function handleAddCashDigit(digit: string) {
    setPaid((prev) => prev + digit);
  }

  function handleAddCashFractionPoint() {
    if (!paid.includes(".")) setPaid((prev) => prev + ".");
  }

  function handleDeleteLastCashChar() {
    setPaid((prev) => prev.slice(0, prev.length - 1));
  }

  function handleEmptyPaid() {
    setPaid("");
  }

  const disabled = isHttpClientLoading || isProductsLocked;

  return (
    <div>
      <Button
        type="button"
        disabled={disabled}
        variant="contained"
        className="gap-2"
        sx={{ ...cashierButtonStyle }}
        fullWidth
        onClick={handleOpen}
      >
        {t("Payment process")}
      </Button>

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minWidth: 400,
            bgcolor: "#F1F5F8",
            boxShadow: 24,
            borderRadius: "16px",
            p: "32px",
            display: "flex",
            gap: "32px",
            width: "max-content",
            maxWidth: "90vw",
          }}
        >
          <div className="flex-grow bg-white p-6 space-y-4 rounded-lg flex flex-col">
            <h3>{t("Payment methods")}</h3>
            <LineBreakAtom />
            <div className="flex flex-col justify-between gap-8 flex-grow">
              <div className="flex gap-4">
                <span className="flex-grow flex">
                  <span className="inline-flex gap-2.5 items-center bg-[#226AB214] px-3 min-w-36 rounded-s-lg">
                    <Image src={moneys} alt="money icon" width={24} height={24} />
                    <span>{t("Cash")}</span>
                  </span>
                  <TextFieldAtom
                    type="number"
                    placeholder={t("Enter value")}
                    value={paid.endsWith(".") ? paid + "0" : paid}
                    disabled={disabled}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setPaid(e.target.value);
                    }}
                    slotProps={{
                      htmlInput: {
                        min: 0,
                        step: 1,
                      },
                      input: {
                        style: {
                          height: "48px",
                          borderColor: "#D6D9E2",
                          borderStartStartRadius: 0,
                          borderEndStartRadius: 0,
                        },
                      },
                    }}
                  />
                </span>
                <ButtonBase
                  disabled={disabled}
                  type="button"
                  className="w-12 h-12 shrink-0 cursor-pointer"
                  sx={{
                    ...cashierIconButtonStyle,
                    border: "1px solid #D6D9E2",
                  }}
                  onClick={handleEmptyPaid}
                >
                  <FiTrash2 width="20" className="w-6 h-6 text-[#404040]" />
                </ButtonBase>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-2">
                  <div className="relative flex-grow flex flex-col justify-center items-center w-44 min-h-28 rounded-lg bg-[#F5F5F5] border border-[var(--primary)] text-[var(--primary)]">
                    <Radio sx={{ position: "absolute", top: 0, insetInlineStart: 0 }} checked color="primary" />
                    <Image src={moneys} alt="money icon" width={24} height={24} />
                    {t("Cash")}
                  </div>
                  <div className="relative flex-grow flex flex-col justify-center items-center w-44 min-h-28 rounded-lg bg-[#F5F5F5] border border-[#D6D9E2]">
                    <Radio sx={{ position: "absolute", top: 0, insetInlineStart: 0 }} checked={false} />
                    <Image src={cardPos} alt="card pos icon" width={24} height={24} />
                    {t("Credit card")}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {["9", "8", "7", "6", "5", "4", "3", "2", "1"].map((x) => (
                    <button
                      key={x}
                      className="w-[86px] h-[56px] rounded-sm border bg-[#EDEDED] border-[#E0E0E0] font-semibold text-xl"
                      onClick={() => handleAddCashDigit(x)}
                    >
                      {x}
                    </button>
                  ))}
                  <button
                    className="w-[86px] h-[56px] rounded-sm border bg-[#EDEDED] border-[#E0E0E0] font-semibold text-xl"
                    onClick={handleDeleteLastCashChar}
                  >
                    <IoBackspaceOutline />
                  </button>
                  <button
                    className="w-[86px] h-[56px] rounded-sm border bg-[#EDEDED] border-[#E0E0E0] font-semibold text-xl"
                    onClick={handleAddCashFractionPoint}
                  >
                    {"."}
                  </button>
                  <button
                    className="w-[86px] h-[56px] rounded-sm border bg-[#EDEDED] border-[#E0E0E0] font-semibold text-xl"
                    onClick={() => handleAddCashDigit("0")}
                  >
                    {"0"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-grow bg-white p-6 space-y-4 rounded-lg">
            <div className="flex flex-col justify-between gap-8">
              <div className="flex flex-col gap-4">
                <div className="grid gap-2 grid-cols-[repeat(3,auto)] items-center bg-[#F5F7FB] rounded-lg pt-1.5 px-4 pb-2">
                  <CiUser className="w-6 h-6" />
                  <span className="me-2">{t("Customer name")}</span>
                  <span>{customer?.name}</span>
                  <GoClock className="w-6 h-6" />
                  <span className="me-2">{t("Date and time")}</span>
                  <span>{dayjs(date).format("HH:mm:ss - DD/MM/YYYY")}</span>
                </div>
                <CashierOrderDetails
                  paid={paid}
                  details={details}
                  discountType={discountType}
                  discountValue={discountValue}
                  setRemainingAmount={setRemainingAmount}
                />
                <Button
                  type="button"
                  disabled={disabled}
                  variant="contained"
                  className="gap-2"
                  sx={{ ...cashierButtonStyle }}
                  fullWidth
                  onClick={() => {
                    onSubmit(InvoiceStatusEnum.Done);
                    handleClose();
                  }}
                >
                  {t("Confirm")}
                </Button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
