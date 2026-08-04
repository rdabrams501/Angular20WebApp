// HTTPClient returned JSON structure field names are ALWAYS lowercase by default

export interface ICourseData{
    id: number;
    name: string;
    teacherid: number;
    studentcount: number;
    startdate: Date;
    enddate: Date;
    notes: string;
}
