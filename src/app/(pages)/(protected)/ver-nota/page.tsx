"use client";
import { useState, useEffect } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import NotaFiscalPDF from "@/utils/NotaFiscalPDF";
import { NotaFiscal } from "@/utils/NotaFiscalPDF/types";
import BarraLateral from "@/app/components/barraLateral";
import { Spin } from "antd";
import { getInvoice } from "@/services/invoice";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingOutlined } from "@ant-design/icons";
import { ArrowDownToLine } from "lucide-react";

const Page = () => {
  const [notaData, setNotaData] = useState<NotaFiscal | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const route = useRouter();

  useEffect(() => {
    if (!id) return route.back();
    setIsLoading(true);
    getInvoice({ id })
      .then(({ data }) => {
        setNotaData(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (!notaData) return <div>Carregando...</div>;

  return (
    <>
      <div className="flex flex-row">
        <BarraLateral />
        <div className="w-screen h-screen px-11 bg-[#F2F5FA]">
          <div className="flex flex-col  py-12  justify-center items-start">
            <h1 className="text-4xl font-bold">Veja sua NF-e</h1>
          </div>
          <div className="w-full flex justify-end">
            <PDFDownloadLink
              document={<NotaFiscalPDF data={notaData} />}
              fileName={`nota-fiscal-${notaData.id}.pdf`}
            >
              {({ loading }) => (
                <Button disabled={loading}>
                  {loading ? (
                    <Spin indicator={<LoadingOutlined />} />
                  ) : (
                    <div className="flex space-x-2">
                      <h1>Baixar Nota</h1>
                      <ArrowDownToLine />
                    </div>
                  )}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
          <PDFViewer width="100%" height="100%" className="py-12">
            <NotaFiscalPDF data={notaData} />
          </PDFViewer>
        </div>
      </div>
    </>
  );
};

export default Page;
