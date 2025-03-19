export class Constants {
    public static FILTER_TEST_ALL = 1;
    public static FILTER_TEST_VALID_PRINTED = 2;
    public static FILTER_TEST_PRINTED = 3;
    public static FILTER_TEST_NOT_VALID = 4;
    public static FILTER_TEST_RESULT = 5;
    public static FILTER_TEST_VALID = 6;
    public static ORDERED = 0;
    public static RERUN = 1;
    public static REPORTED = 2;
    public static PREVIEW = 3;
    public static VALIDATED = 4;
    public static DELIVERED = 5;
    public static FINALDELIVERED = 6;
    public static ACCOUNT = -1;
    public static PHYSICIAN = -2;
    public static RATE = -3;
    public static ORDERTYPE = -4;
    public static BRANCH = -5;
    public static SERVICE = -6;
    public static RACE = -7;
    public static WEIGHT = -8;
    public static SIZE = -9;
    public static DOCUMENT_TYPE = -10;
    public static AGE_GROUP = -11;
    public static PATIENT_SEX = -104;
    public static PATIENT_ID = -100;
    public static NEW_SAMPLE = 1;
    public static PATIENT_LAST_NAME = -101;
    public static PATIENT_SURNAME = -102;
    public static PATIENT_NAME = -103;
    public static PATIENT_SECOND_NAME = -109;
    public static PATIENT_AGE = -110;

}

export class ResultSampleState {
    public static PENDING = -1;
    public static REJECTED = 0;
    public static NEW_SAMPLE = 1;
    public static ORDERED = 2;
    public static COLLECTED = 3;
    public static CHECKED = 4;
}


export class ResultTestState {
    public static ORDERED = 0;
    public static RERUN = 1;
    public static REPORTED = 2;
    public static PREVIEW = 3;
    public static VALIDATED = 4;
    public static DELIVERED = 5;
    public static FINALDELIVERED = 6;
}

export class DashboardModule {
    public static ORDERED = 0;
    public static CHECKED = 1;
    public static REPORTED = 2;
    public static VALIDATED = 3;   
}


export class StorageConstanst {
    public static DIR_STORAGE = `${process.env.DIR_STORAGE || 'C:\\images'}/storage_NT`;
    public static DIR_STORAGE_ORDERS = `${process.env.DIR_STORAGE || 'C:\\images'}/storage_NT/storage_reports/orders`;
    public static DIR_STORAGE_RESULTS = `${process.env.DIR_STORAGE || 'C:\\images'}/storage_NT/storage_reports/users`;
}