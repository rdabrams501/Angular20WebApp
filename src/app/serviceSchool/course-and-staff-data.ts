// HTTPClient returned JSON structure field names are ALWAYS lowercase by default

export interface ICourseAndStaffData{
    id: number;
    name: string;
    teacherid: number;
    studentcount: number;
    startdate: Date;
    enddate: Date;
    notes: string;
    staff: string;
    position: string;
    status: string;
}
