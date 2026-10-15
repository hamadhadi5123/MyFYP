import { Dataset } from '../types';
import { parseCSV } from '../utils/csvParser';

export const STUDENT_PERFORMANCE_CSV = `student_id,gender,study_hours_weekly,attendance_rate,previous_score,sleep_hours,tutoring_attended,final_exam_score
STU_101,Female,14.5,92.0,84,7.5,Yes,88
STU_102,Male,8.0,78.5,65,6.0,No,68
STU_103,Male,18.0,96.0,91,8.0,Yes,95
STU_104,Female,5.5,68.0,52,5.5,No,54
STU_105,Male,12.0,88.5,,7.0,No,81
STU_106,Female,16.5,94.0,89,7.5,Yes,92
STU_107,Male,7.5,74.0,60,6.5,No,62
STU_108,Female,11.0,85.0,76,7.0,Yes,79
STU_109,Male,4.0,58.0,45,5.0,No,48
STU_110,Female,19.5,98.0,95,8.0,Yes,98
STU_111,Male,13.0,89.0,82,7.0,No,84
STU_112,Female,9.5,81.0,71,6.5,No,73
STU_113,Male,15.0,93.5,88,,Yes,90
STU_114,Female,6.0,71.0,58,6.0,No,59
STU_115,Male,10.5,83.0,74,7.0,No,76
STU_116,Female,17.0,95.0,90,7.5,Yes,93
STU_117,Male,8.5,79.0,67,6.5,No,70
STU_118,Female,12.5,87.0,79,7.0,Yes,83
STU_119,Male,3.5,52.0,40,5.0,No,42
STU_120,Female,15.5,91.0,86,7.5,Yes,89
STU_120,Female,15.5,91.0,86,7.5,Yes,89
STU_121,Male,11.5,84.0,,7.0,No,77
STU_122,Female,7.0,75.0,63,6.0,No,65
STU_123,Male,16.0,94.5,92,8.0,Yes,94
STU_124,Female,5.0,66.0,50,5.5,No,51`;

export const SALES_REVENUE_CSV = `order_id,region,category,units_sold,unit_price,discount_rate,shipping_days,profit
ORD_501,North,Electronics,4,299.99,0.10,3,179.99
ORD_502,West,Furniture,2,450.00,0.15,5,94.50
ORD_503,East,Office Supplies,15,18.50,0.05,2,83.25
ORD_504,South,Electronics,1,899.99,0.20,4,143.99
ORD_505,North,Office Supplies,8,34.00,,3,68.00
ORD_506,West,Electronics,3,550.00,0.10,2,247.50
ORD_507,South,Furniture,1,720.00,0.25,6,108.00
ORD_508,East,Electronics,5,199.99,0.05,3,189.99
ORD_509,North,Furniture,2,380.00,0.15,4,114.00
ORD_510,West,Office Supplies,25,12.00,0.00,1,105.00
ORD_511,South,Electronics,2,620.00,,4,186.00
ORD_512,East,Furniture,3,310.00,0.10,5,139.50
ORD_513,North,Office Supplies,12,22.00,0.05,2,92.40
ORD_514,West,Electronics,6,150.00,0.15,3,153.00
ORD_514,West,Electronics,6,150.00,0.15,3,153.00
ORD_515,South,Office Supplies,18,15.50,0.00,2,97.65
ORD_516,East,Electronics,4,420.00,0.10,3,252.00
ORD_517,North,Furniture,1,850.00,0.20,7,136.00`;

export const WEATHER_ENERGY_CSV = `record_date,temperature_c,relative_humidity,wind_speed_kmh,solar_radiation,grid_energy_demand_mw
2026-06-01,34.2,45,12.5,880,4820
2026-06-02,36.8,40,14.2,920,5150
2026-06-03,38.5,38,16.0,950,5480
2026-06-04,32.0,55,10.8,760,4500
2026-06-05,29.5,68,18.5,610,4120
2026-06-06,28.0,74,22.0,540,3980
2026-06-07,31.4,58,11.2,790,4410
2026-06-08,35.6,42,13.8,910,4990
2026-06-09,37.2,39,15.1,940,5280
2026-06-10,39.0,35,17.4,980,5620
2026-06-11,33.5,50,12.0,,4690
2026-06-12,30.2,64,19.1,640,4210
2026-06-13,27.5,78,24.5,490,3870
2026-06-14,32.8,52,13.0,810,4590
2026-06-15,36.0,44,14.6,900,5080`;

export function getSampleDatasets(): Record<string, Dataset> {
  return {
    student: parseCSV(STUDENT_PERFORMANCE_CSV, 'Student Performance Benchmark'),
    sales: parseCSV(SALES_REVENUE_CSV, 'Retail Sales & Profitability'),
    weather: parseCSV(WEATHER_ENERGY_CSV, 'Weather & Grid Energy Demand'),
  };
}
