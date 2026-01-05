import React from "react"
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer"
import { ReceiptFormData } from "./validations"
import { CostBreakdown } from "./pricing-calculator"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
    borderBottom: "2 solid #000",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    padding: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    paddingVertical: 4,
  },
  label: {
    fontWeight: "bold",
    width: "40%",
  },
  value: {
    width: "60%",
  },
  table: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #ddd",
    paddingVertical: 6,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTop: "2 solid #000",
    fontWeight: "bold",
    fontSize: 14,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: "1 solid #ddd",
    fontSize: 10,
    color: "#666",
  },
})

export async function generateReceiptPDF(
  data: ReceiptFormData,
  breakdown: CostBreakdown
): Promise<Buffer> {
  const ReceiptDocument = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Itemized Receipt</Text>
          <Text>Receipt Date: {data.chargeDate.toLocaleDateString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{data.patientName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>{data.patientDOB.toLocaleDateString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Coverage Period:</Text>
            <Text style={styles.value}>
              {data.coverageStartDate.toLocaleDateString()} -{" "}
              {data.coverageEndDate.toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>State:</Text>
            <Text style={styles.value}>{data.patientState}</Text>
          </View>
        </View>

        {(data.providerName || data.providerNPI || data.diagnosisCode || data.procedureCode) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Provider Information</Text>
            {data.providerName && (
              <View style={styles.row}>
                <Text style={styles.label}>Provider Name:</Text>
                <Text style={styles.value}>{data.providerName}</Text>
              </View>
            )}
            {data.providerNPI && (
              <View style={styles.row}>
                <Text style={styles.label}>NPI:</Text>
                <Text style={styles.value}>{data.providerNPI}</Text>
              </View>
            )}
            {data.diagnosisCode && (
              <View style={styles.row}>
                <Text style={styles.label}>Diagnosis Code:</Text>
                <Text style={styles.value}>{data.diagnosisCode}</Text>
              </View>
            )}
            {data.procedureCode && (
              <View style={styles.row}>
                <Text style={styles.label}>Procedure Code:</Text>
                <Text style={styles.value}>{data.procedureCode}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itemized Breakdown</Text>

          {breakdown.pharmacy.length > 0 && (
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Pharmacy Costs</Text>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.tableCell}>Item</Text>
                  <Text style={styles.tableCell}>Quantity</Text>
                  <Text style={styles.tableCell}>Unit Price</Text>
                  <Text style={styles.tableCell}>Total</Text>
                </View>
                {breakdown.pharmacy.map((item, idx) => (
                  <View key={idx} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.name}</Text>
                    <Text style={styles.tableCell}>{item.quantity}</Text>
                    <Text style={styles.tableCell}>${item.unitPrice.toFixed(2)}</Text>
                    <Text style={styles.tableCell}>${item.total.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {breakdown.lab.length > 0 && (
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Lab Costs</Text>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.tableCell}>Item</Text>
                  <Text style={styles.tableCell}>Quantity</Text>
                  <Text style={styles.tableCell}>Unit Price</Text>
                  <Text style={styles.tableCell}>Total</Text>
                </View>
                {breakdown.lab.map((item, idx) => (
                  <View key={idx} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.name}</Text>
                    <Text style={styles.tableCell}>{item.quantity}</Text>
                    <Text style={styles.tableCell}>${item.unitPrice.toFixed(2)}</Text>
                    <Text style={styles.tableCell}>${item.total.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {breakdown.clinical.length > 0 && (
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                Clinical Provider Services
              </Text>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.tableCell}>Item</Text>
                  <Text style={styles.tableCell}>Quantity</Text>
                  <Text style={styles.tableCell}>Unit Price</Text>
                  <Text style={styles.tableCell}>Total</Text>
                </View>
                {breakdown.clinical.map((item, idx) => (
                  <View key={idx} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.name}</Text>
                    <Text style={styles.tableCell}>{item.quantity}</Text>
                    <Text style={styles.tableCell}>${item.unitPrice.toFixed(2)}</Text>
                    <Text style={styles.tableCell}>${item.total.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {breakdown.operational.length > 0 && (
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Operational Costs</Text>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.tableCell}>Item</Text>
                  <Text style={styles.tableCell}>Quantity</Text>
                  <Text style={styles.tableCell}>Unit Price</Text>
                  <Text style={styles.tableCell}>Total</Text>
                </View>
                {breakdown.operational.map((item, idx) => (
                  <View key={idx} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.name}</Text>
                    <Text style={styles.tableCell}>{item.quantity}</Text>
                    <Text style={styles.tableCell}>${item.unitPrice.toFixed(2)}</Text>
                    <Text style={styles.tableCell}>${item.total.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {breakdown.core.length > 0 && (
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                Core Membership Fee
              </Text>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.tableCell}>Item</Text>
                  <Text style={styles.tableCell}>Quantity</Text>
                  <Text style={styles.tableCell}>Unit Price</Text>
                  <Text style={styles.tableCell}>Total</Text>
                </View>
                {breakdown.core.map((item, idx) => (
                  <View key={idx} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.name}</Text>
                    <Text style={styles.tableCell}>{item.quantity}</Text>
                    <Text style={styles.tableCell}>${item.unitPrice.toFixed(2)}</Text>
                    <Text style={styles.tableCell}>${item.total.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {breakdown.adjustment && (
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Adjustment</Text>
              <View style={styles.row}>
                <Text style={styles.label}>{breakdown.adjustment.name}:</Text>
                <Text style={styles.value}>${breakdown.adjustment.amount.toFixed(2)}</Text>
              </View>
              <Text style={{ fontSize: 10, color: "#666", marginTop: 5 }}>
                Reason: {breakdown.adjustment.reason}
              </Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text>Total Charge Amount:</Text>
            <Text>${data.chargeAmount.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Plan: ${data.planPrice} / {data.planWeeks} weeks</Text>
          <Text>Medications: {data.medications.join(", ")}</Text>
        </View>
      </Page>
    </Document>
  )

  const pdfDoc = await pdf(ReceiptDocument).toBlob()
  const arrayBuffer = await pdfDoc.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

