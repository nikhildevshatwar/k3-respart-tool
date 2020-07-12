
/* Keystone3 Quality of service endpoint definitions
 * Auto generated by K3 Resource Partitioning Tool
 */

#define QOS_0	(0 << 0)
#define QOS_1	(1 << 0)
#define QOS_2	(2 << 0)
#define QOS_3	(3 << 0)
#define QOS_4	(4 << 0)
#define QOS_5	(5 << 0)
#define QOS_6	(6 << 0)
#define QOS_7	(7 << 0)

#define ORDERID_0	(0 << 4)
#define ORDERID_1	(1 << 4)
#define ORDERID_2	(2 << 4)
#define ORDERID_3	(3 << 4)
#define ORDERID_4	(4 << 4)
#define ORDERID_5	(5 << 4)
#define ORDERID_6	(6 << 4)
#define ORDERID_7	(7 << 4)
#define ORDERID_8	(8 << 4)
#define ORDERID_9	(9 << 4)
#define ORDERID_10	(10 << 4)
#define ORDERID_11	(11 << 4)
#define ORDERID_12	(12 << 4)
#define ORDERID_13	(13 << 4)
#define ORDERID_14	(14 << 4)
#define ORDERID_15	(15 << 4)

#define ASEL_0	(0 << 8)
#define ASEL_1	(1 << 8)
#define ASEL_2	(2 << 8)
#define ASEL_3	(3 << 8)
#define ASEL_4	(4 << 8)
#define ASEL_5	(5 << 8)
#define ASEL_6	(6 << 8)
#define ASEL_7	(7 << 8)
#define ASEL_8	(8 << 8)
#define ASEL_9	(9 << 8)
#define ASEL_10	(10 << 8)
#define ASEL_11	(11 << 8)
#define ASEL_12	(12 << 8)
#define ASEL_13	(13 << 8)
#define ASEL_14	(14 << 8)
#define ASEL_15	(15 << 8)

#define EPRIORITY_0	(0 << 12)
#define EPRIORITY_1	(1 << 12)
#define EPRIORITY_2	(2 << 12)
#define EPRIORITY_3	(3 << 12)
#define EPRIORITY_4	(4 << 12)
#define EPRIORITY_5	(5 << 12)
#define EPRIORITY_6	(6 << 12)
#define EPRIORITY_7	(7 << 12)

#define VIRTID_0	(0 << 16)
#define VIRTID_1	(1 << 16)
#define VIRTID_2	(2 << 16)
#define VIRTID_3	(3 << 16)
#define VIRTID_4	(4 << 16)
#define VIRTID_5	(5 << 16)
#define VIRTID_6	(6 << 16)
#define VIRTID_7	(7 << 16)
#define VIRTID_8	(8 << 16)
#define VIRTID_9	(9 << 16)
#define VIRTID_10	(10 << 16)
#define VIRTID_11	(11 << 16)
#define VIRTID_12	(12 << 16)
#define VIRTID_13	(13 << 16)
#define VIRTID_14	(14 << 16)
#define VIRTID_15	(15 << 16)

#define ATYPE_0	(0 << 28)
#define ATYPE_1	(1 << 28)
#define ATYPE_2	(2 << 28)
#define ATYPE_3	(3 << 28)

#define PULSAR_SL_MCU_0_MEMBDG_RMST0	0x45D10100
#define PULSAR_SL_MCU_0_MEMBDG_WMST0	0x45D10500
#define PULSAR_SL_MCU_0_CPU0_PMST	0x45D10900
#define PULSAR_SL_MCU_0_MEMBDG_RMST1	0x45D11100
#define PULSAR_SL_MCU_0_MEMBDG_WMST1	0x45D11500
#define PULSAR_SL_MCU_0_CPU1_PMST	0x45D11900
#define SA2_UL_MCU_0_CTXCACH_EXT_DMA	0x45D13100
#define NAVSS_MCU_J7_MCU_0_PROXY0_DST	0x45D20100
#define NAVSS_MCU_J7_MCU_0_SEC_PROXY0_DST	0x45D20500
#define NAVSS_MCU_J7_MCU_0_RINGACC0_DST	0x45D20D00
#define NAVSS512L_MAIN_0_PROXY0_DST	0x45D40100
#define NAVSS512L_MAIN_0_SEC_PROXY0_DST	0x45D40500
#define NAVSS512L_MAIN_0_RINGACC0_DST	0x45D48100
#define NAVSS512L_MAIN_0_TCU_MSTR	0x45D50100
#define NAVSS512L_MAIN_0_TCU_MSTW	0x45D50500
#define ICSS_G_16FFC_MAIN_0_PR1_EXT_VBUSM	0x45D80100
#define ICSS_G_16FFC_MAIN_1_PR1_EXT_VBUSM	0x45D80500
#define K3_C66_COREPAC_MAIN_0_C66_MDMA	0x45D81100
#define K3_C66_COREPAC_MAIN_1_C66_MDMA	0x45D81500
#define EMMCSD4SS_MAIN_0_EMMCSDSS_RD	0x45D82100
#define EMMCSD4SS_MAIN_0_EMMCSDSS_WR	0x45D82500
#define EMMCSD4SS_MAIN_1_EMMCSDSS_RD	0x45D82900
#define EMMCSD4SS_MAIN_1_EMMCSDSS_WR	0x45D82D00
#define PULSAR_SL_MAIN_0_MEMBDG_RMST0	0x45D84100
#define PULSAR_SL_MAIN_0_MEMBDG_RMST1	0x45D84500
#define PULSAR_SL_MAIN_0_MEMBDG_WMST0	0x45D84900
#define PULSAR_SL_MAIN_0_MEMBDG_WMST1	0x45D84D00
#define PULSAR_SL_MAIN_1_MEMBDG_RMST0	0x45D85100
#define PULSAR_SL_MAIN_1_MEMBDG_RMST1	0x45D85500
#define PULSAR_SL_MAIN_1_MEMBDG_WMST0	0x45D85900
#define PULSAR_SL_MAIN_1_MEMBDG_WMST1	0x45D85D00
#define COMPUTE_CLUSTER_J7ES_TB_VDC_MAIN_0_GIC_MEM_RD_VBUSM	0x45D86100
#define COMPUTE_CLUSTER_J7ES_TB_VDC_MAIN_0_GIC_MEM_WR_VBUSM	0x45D86500
#define K3_C66_COREPAC_MAIN_0_C66_CFG	0x45D87100
#define K3_C66_COREPAC_MAIN_1_C66_CFG	0x45D87500
#define SA2_UL_MAIN_0_CTXCACH_EXT_DMA	0x45D88900
#define PULSAR_SL_MAIN_0_PBDG_RMST0	0x45D89900
#define PULSAR_SL_MAIN_0_PBDG_RMST1	0x45D89D00
#define PULSAR_SL_MAIN_0_PBDG_WMST0	0x45D8A100
#define PULSAR_SL_MAIN_0_PBDG_WMST1	0x45D8A500
#define PULSAR_SL_MAIN_1_PBDG_RMST0	0x45D8A900
#define PULSAR_SL_MAIN_1_PBDG_RMST1	0x45D8AD00
#define PULSAR_SL_MAIN_1_PBDG_WMST0	0x45D8B100
#define PULSAR_SL_MAIN_1_PBDG_WMST1	0x45D8B500
#define VPFE_MAIN_0_VBUSM_DMA	0x45D8C100
#define PCIE_G4X2_MAIN_0_PCIE_MST_RD_HP	0x45D90100
#define PCIE_G4X2_MAIN_0_PCIE_MST_RD_LP	0x45D90500
#define PCIE_G4X2_MAIN_0_PCIE_MST_WR_HP	0x45D90900
#define PCIE_G4X2_MAIN_0_PCIE_MST_WR_LP	0x45D90D00
#define PCIE_G4X2_MAIN_1_PCIE_MST_RD_HP	0x45D91100
#define PCIE_G4X2_MAIN_1_PCIE_MST_RD_LP	0x45D91500
#define PCIE_G4X2_MAIN_1_PCIE_MST_WR_HP	0x45D91900
#define PCIE_G4X2_MAIN_1_PCIE_MST_WR_LP	0x45D91D00
#define PCIE_G4X2_MAIN_2_PCIE_MST_RD_HP	0x45D92100
#define PCIE_G4X2_MAIN_2_PCIE_MST_RD_LP	0x45D92500
#define PCIE_G4X2_MAIN_2_PCIE_MST_WR_HP	0x45D92900
#define PCIE_G4X2_MAIN_2_PCIE_MST_WR_LP	0x45D92D00
#define PCIE_G4X2_MAIN_3_PCIE_MST_RD_HP	0x45D93100
#define PCIE_G4X2_MAIN_3_PCIE_MST_RD_LP	0x45D93500
#define PCIE_G4X2_MAIN_3_PCIE_MST_WR_HP	0x45D93900
#define PCIE_G4X2_MAIN_3_PCIE_MST_WR_LP	0x45D93D00
#define USB3P0SS_16FFC_MAIN_0_MSTR0	0x45D98100
#define USB3P0SS_16FFC_MAIN_0_MSTW0	0x45D98500
#define USB3P0SS_16FFC_MAIN_1_MSTR0	0x45D98900
#define USB3P0SS_16FFC_MAIN_1_MSTW0	0x45D98D00
#define MLBSS2P0_MAIN_0_MLBSS_DMA_VBUSP	0x45D99D00
#define EMMC8SS_16FFC_MAIN_0_EMMCSS_RD	0x45D9A100
#define EMMC8SS_16FFC_MAIN_0_EMMCSS_WR	0x45D9A500
#define UFSHCI2P1SS_16FFC_MAIN_0_UFSHCI_VBM_MST_RD	0x45D9B100
#define UFSHCI2P1SS_16FFC_MAIN_0_UFSHCI_VBM_MST_WR	0x45D9B500
#define DEBUGSS_K3_WRAP_CV0_MAIN_0_VBUSMR	0x45DA0100
#define DEBUGSS_K3_WRAP_CV0_MAIN_0_VBUSMW	0x45DA0500
#define PULSAR_SL_MAIN_0_CPU0_PMST	0x45DA4100
#define PULSAR_SL_MAIN_0_CPU1_PMST	0x45DA4500
#define PULSAR_SL_MAIN_1_CPU0_PMST	0x45DA4900
#define PULSAR_SL_MAIN_1_CPU1_PMST	0x45DA4D00
#define DMPAC_TOP_MAIN_0_DATA_MST	0x45DC0100
#define K3_D5520MP2_MAIN_0_M_VBUSM_R	0x45DC0500
#define K3_D5520MP2_MAIN_0_M_VBUSM_W	0x45DC0900
#define K3_VXE384MP2_MAIN_0_M_VBUSM_R	0x45DC0D00
#define K3_VXE384MP2_MAIN_0_M_VBUSM_W	0x45DC1100
#define VPAC_TOP_MAIN_0_DATA_MST_0	0x45DC1500
#define VPAC_TOP_MAIN_0_DATA_MST_1	0x45DC1900
#define VPAC_TOP_MAIN_0_LDC0_M_MST	0x45DC1D00
#define K3_DSS_MAIN_0_DSS_INST0_VBUSM_DMA	0x45DC2100
#define K3_DSS_MAIN_0_DSS_INST0_VBUSM_FBDC	0x45DC2500
#define J7_LASCAR_GPU_WRAP_MAIN_0_M0_VBUSM_R_ASYNC	0x45DC5100
#define J7_LASCAR_GPU_WRAP_MAIN_0_M0_VBUSM_W_ASYNC	0x45DC5900
#define J7_LASCAR_GPU_WRAP_MAIN_0_M1_VBUSM_R_ASYNC	0x45DC6100
#define J7_LASCAR_GPU_WRAP_MAIN_0_M1_VBUSM_W_ASYNC	0x45DC6900
