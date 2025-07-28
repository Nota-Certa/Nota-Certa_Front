import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { NotaFiscal } from "./types";
import { calcularTotais, formatCurrency, formatDate } from "@/lib/utils";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontSize: 9,
  },
  header: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  section: {
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: "30%",
    fontWeight: "bold",
  },
  value: {
    width: "70%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 4,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  col1: { width: "30%", paddingRight: 5 },
  col2: { width: "10%", textAlign: "right", paddingRight: 5 },
  col3: { width: "15%", textAlign: "right", paddingRight: 5 },
  col4: { width: "20%", textAlign: "right", paddingRight: 5 },
  col5: { width: "25%", textAlign: "right" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    fontWeight: "bold",
  },
  impostosText: {
    fontSize: 8,
  },
});

const NotaFiscalPDF = ({ data }: { data: NotaFiscal }) => {
  const valores = calcularTotais(data.itens);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>NOTA FISCAL</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Nº Nota Fiscal:</Text>
            <Text style={styles.value}>{data.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Cliente:</Text>
            <Text style={styles.value}>{data.nome_razao_social}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>CPF/CNPJ:</Text>
            <Text style={styles.value}>{data.documento}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Data Emissão:</Text>
            <Text style={styles.value}>{formatDate(data.data_emissao)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Data Vencimento:</Text>
            <Text style={styles.value}>{formatDate(data.data_vencimento)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{data.status.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ marginBottom: 4, fontWeight: "bold" }}>Itens:</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Descrição</Text>
            <Text style={styles.col2}>Qtd</Text>
            <Text style={styles.col3}>Unitário</Text>
            <Text style={styles.col4}>Impostos</Text>
            <Text style={styles.col5}>Total Item</Text>
          </View>

          {data.itens.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.col1}>{item.descricao}</Text>
              <Text style={styles.col2}>{item.quantidade}</Text>
              <Text style={styles.col3}>
                R$ {formatCurrency(item.valor_unitario)}
              </Text>
              <Text style={[styles.col4, styles.impostosText]}>
                IPI: R$ {formatCurrency(item.impostos.IPI.toString())}
                {" | "}
                ICMS: R$ {formatCurrency(item.impostos.ICMS.toString())}
                {" | "}
                COFINS : R$ {formatCurrency(item.impostos.COFINS.toString())}
                {" | "}
                PIS: R$ {formatCurrency(item.impostos.PIS.toString())}
              </Text>
              <Text style={styles.col5}>
                R${" "}
                {formatCurrency(
                  (
                    parseFloat(item.valor_unitario) * item.quantidade +
                    item.impostos.IPI +
                    item.impostos.ICMS +
                    item.impostos.COFINS +
                    item.impostos.PIS
                  ).toString()
                )}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.totalRow}>
          <Text>
            VALOR TOTAL DE IMPOSTOS: R${" "}
            {formatCurrency(valores.valorTotalDeImposto)}
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text>VALOR TOTAL: R$ {formatCurrency(valores.valorTotalNota)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default NotaFiscalPDF;
