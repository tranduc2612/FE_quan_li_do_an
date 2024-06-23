use master
drop database ManagementGraduationProject
create database ManagementGraduationProject
use ManagementGraduationProject

create table Classification(
	ClassifiId nvarchar(50) primary key default NEWID(),
	TypeCode NVARCHAR(50),
	Code NVARCHAR(50),
	Value NVARCHAR(MAX),
	Role NVARCHAR(50),
	FileName NVARCHAR(MAX),
	Url NVARCHAR(MAX)
)

create table Major(
	MajorId NVARCHAR(10) primary key,
	MajorName nvarchar(max),
)

alter table Major add CreatedAt datetime default GETDATE()
alter table Major add CreatedBy nvarchar(50)

CREATE TABLE Student (
	UserName NVARCHAR(50) PRIMARY KEY,
	Password varbinary(max),
	FullName NVARCHAR(MAX),

    DOB DATE,
    Phone NVARCHAR(20),
    Email NVARCHAR(50),
    Avatar NVARCHAR(MAX),

	CreatedAt DATETIME DEFAULT GETDATE(),
    CreatedBy NVARCHAR(50),
    Status VARCHAR(50) DEFAULT 'AUTH',
    StudentCode NVARCHAR(30),

    MajorId NVARCHAR(10),
    ClassName NVARCHAR(50),
	SchoolYearName NVARCHAR(50),
	IsDelete int default 0,

	Token NVARCHAR(MAX),
	PasswordSalt	varbinary(max),
	RefreshToken	varchar(max),
	TokenCreated	datetime,
	tokenExpires	datetime,
	CONSTRAINT FK_Student_Major FOREIGN KEY (MajorId)
    REFERENCES Major(MajorId),
)
alter table Student add TypeFileAvatar nvarchar(50);

alter table Student add UserNameMentorRegister NVARCHAR(50)

ALTER TABLE Student
ADD FOREIGN KEY (UserNameMentorRegister) REFERENCES Teacher(UserName);

alter table Student add IsFirstTime int default 1


CREATE TABLE Education (
    EducationId NVARCHAR(50) primary key,
	EducationName NVARCHAR(max),
	MaxStudentMentor int,
)

alter table Education add CreatedAt datetime default GETDATE()
alter table Education add CreatedBy nvarchar(50)

CREATE TABLE Teacher (
	UserName NVARCHAR(50) PRIMARY KEY,
	FullName NVARCHAR(MAX),

	Password varbinary(max),
    DOB DATE,
    Phone NVARCHAR(20),
    Email NVARCHAR(50),
    Avatar NVARCHAR(MAX),

	CreatedAt DATETIME DEFAULT GETDATE(),
    CreatedBy NVARCHAR(50),
    Status VARCHAR(50) DEFAULT 'AUTH',
	IsAdmin int,
	IsDelete int default 0,

	Token NVARCHAR(MAX),
	PasswordSalt	varbinary(max),
	RefreshToken	varchar(max),
	TokenCreated	datetime,
	tokenExpires	datetime,
	MajorId NVARCHAR(10),
	CONSTRAINT FK_Teacher_Major FOREIGN KEY (MajorId)
    REFERENCES Major(MajorId),
)

alter table Teacher add EducationId NVARCHAR(50)

ALTER TABLE Teacher
ADD CONSTRAINT FK_Teacher_Education FOREIGN KEY (EducationId) REFERENCES Education(EducationId);



alter table Teacher add TypeFileAvatar nvarchar(50);

create table Semester(
	SemesterId nvarchar(50) PRIMARY KEY,
	NameSemester nvarchar(50),
	FromDate date,
	ToDate date,
	ScheduleSemesterId nvarchar(50)
)

create table Council(
	CouncilId nvarchar(50) primary key default NEWID(),
	CouncilName nvarchar(100),
	CouncilZoom nvarchar(100),
	CreatedBy nvarchar(50)
)
select * from Council
alter table Council add SemesterId nvarchar(50)

ALTER TABLE Council
ADD FOREIGN KEY (SemesterId) REFERENCES Semester(SemesterId);

alter table Council add IsDelete int default 0
alter table Council add CreatedDate datetime default getdate()

create table Project(
	UserName NVARCHAR(50) PRIMARY KEY,
	SemesterId nvarchar(50),
	CouncilId nvarchar(50),
	UserNameCommentator NVARCHAR(50),
	UserNameMentor NVARCHAR(50),

	CONSTRAINT FK_Project_Semester FOREIGN KEY (SemesterId)
    REFERENCES Semester(SemesterId),
	CONSTRAINT FK_Project_Council FOREIGN KEY (CouncilId)
    REFERENCES Council(CouncilId),
	CONSTRAINT FK_Project_Student FOREIGN KEY (UserName)
    REFERENCES Student(UserName),
	CONSTRAINT FK_Project_Teacher_Mentor FOREIGN KEY (UserNameMentor)
    REFERENCES Teacher(UserName),
	CONSTRAINT FK_Project_Teacher_Commentator FOREIGN KEY (UserNameCommentator)
    REFERENCES Teacher(UserName),
)

alter table Project add ScoreMentor float
alter table Project add CommentMentor nvarchar(max)
alter table Project add CommentCommentator nvarchar(max)
alter table Project add ScoreCommentator float

alter table Project add	NameFileFinal nvarchar(max);
alter table Project add	SizeFileFinal nvarchar(max);
alter table Project add TypeFileFinal nvarchar(max);


alter table Project add ScoreUV1 float
alter table Project add CommentUV1 nvarchar(max)
alter table Project add ScoreUV2 float
alter table Project add CommentUV2 nvarchar(max)
alter table Project add ScoreUV3 float
alter table Project add CommentUV3 nvarchar(max)
alter table Project add ScoreTK float
alter table Project add CommentTK nvarchar(max)
alter table Project add ScoreCT float
alter table Project add CommentCT nvarchar(max)
alter table Project add HashKeyMentor nvarchar(max)
alter table Project add HashKeyCommentator nvarchar(max)

alter table Project add ScoreFinal float



create table GroupReviewOutline(
	GroupReviewOutlineId nvarchar(50) primary key default NEWID(),
	NameGroupReviewOutline nvarchar(50),
	CreatedBy nvarchar(50),
	CreatedDate datetime default getdate(),
	
)
alter table GroupReviewOutline add SemesterId nvarchar(50)

ALTER TABLE GroupReviewOutline
ADD FOREIGN KEY (SemesterId) REFERENCES Semester(SemesterId);

ALTER TABLE GroupReviewOutline
add IsDelete int default 0;

create table ProjectOutline(
	UserName NVARCHAR(50) PRIMARY KEY,
	NameProject nvarchar(max),
	PlantOutline nvarchar(max),
	TechProject nvarchar(max),
	ExpectResult nvarchar(max),
	ContentProject nvarchar(max),
	GroupReviewOutlineId nvarchar(50),
	CONSTRAINT FK_ProjectOutline_Project FOREIGN KEY (UserName)
    REFERENCES Project(UserName),
	CONSTRAINT FK_ProjectOutline_GroupReviewOutline FOREIGN KEY (GroupReviewOutlineId)
    REFERENCES GroupReviewOutline(GroupReviewOutlineId)
)

create table Comment(
	CommentId nvarchar(50) primary key default NEWID(),
	ContentComment nvarchar(max),
	CreatedBy nvarchar(50),
	CreatedDate datetime default getdate(),
	UserName NVARCHAR(50),
	CONSTRAINT FK_Comment_ProjectOutline FOREIGN KEY (UserName)
    REFERENCES ProjectOutline(UserName),
	CONSTRAINT FK_Comment_Teacher FOREIGN KEY (CreatedBy)
    REFERENCES Teacher(UserName)
)

create table Teaching(
	UserNameTeacher NVARCHAR(50),
	SemesterId nvarchar(50),
	GroupReviewOutlineId nvarchar(50),
	CouncilId nvarchar(50),

	CONSTRAINT FK_Teaching_Teacher FOREIGN KEY (UserNameTeacher)
    REFERENCES Teacher(UserName),
	CONSTRAINT FK_Teaching_Semester FOREIGN KEY (SemesterId)
    REFERENCES Semester(SemesterId),
	CONSTRAINT FK_Teaching_GroupReviewOutline FOREIGN KEY (GroupReviewOutlineId)
    REFERENCES GroupReviewOutline(GroupReviewOutlineId),
	CONSTRAINT FK_Teaching_Council FOREIGN KEY (CouncilId)
    REFERENCES Council(CouncilId),
	PRIMARY KEY (SemesterId,UserNameTeacher)
)
alter table Teaching add PositionInCouncil nvarchar(50);


create table ScheduleWeek(
	ScheduleWeekId nvarchar(50) primary key default NEWID(),
	FromDate datetime,
	ToDate datetime,
	CreatedBy nvarchar(50),
	CreatedDate datetime,
	SemesterId nvarchar(50),
	CONSTRAINT FK_ScheduleWeek_Semester FOREIGN KEY (SemesterId)
    REFERENCES Semester(SemesterId),
	CONSTRAINT FK_ScheduleWeek_Teacher FOREIGN KEY (CreatedBy)
    REFERENCES Teacher(UserName),
)


alter table ScheduleWeek add Title nvarchar(max);
alter table ScheduleWeek add Content nvarchar(max);


create table DetailScheduleWeek(
	ScheduleWeekId nvarchar(50),
	UserNameProject NVARCHAR(50),
	Comment nvarchar(max),
	NameFile nvarchar(max),
	SizeFile nvarchar(max),
	CreatedDate date default getdate(),
	PRIMARY KEY (ScheduleWeekId, UserNameProject),
	CONSTRAINT FK_DetailScheduleWeek_ScheduleWeek FOREIGN KEY (ScheduleWeekId)
    REFERENCES ScheduleWeek(ScheduleWeekId),
	CONSTRAINT FK_DetailScheduleWeek_Project FOREIGN KEY (UserNameProject)
    REFERENCES Project(UserName),
)


create table ScheduleSemester(
	ScheduleSemesterId nvarchar(50) primary key default NEWID(),
	FromDate datetime,
	ToDate datetime,
	TypeSchedule nvarchar(50),
	SemesterId nvarchar(50),
	CreatedBy nvarchar(50),
	CreatedDate datetime DEFAULT GETDATE(),
	CONSTRAINT FK_ScheduleSemester_Semester FOREIGN KEY (SemesterId)
    REFERENCES Semester(SemesterId),
	CONSTRAINT FK_ScheduleSemester_Teacher FOREIGN KEY (CreatedBy)
    REFERENCES Teacher(UserName)
)
ALTER TABLE ScheduleSemester
ADD StatusSend nvarchar(10) default 'W';

ALTER TABLE ScheduleSemester
ADD Title nvarchar(max);

ALTER TABLE Student
ADD Gender int;

ALTER TABLE Student
ADD GPA Float;

ALTER TABLE Student
ADD Address nvarchar(max);

ALTER TABLE Teacher
ADD Gender int;

ALTER TABLE Teacher
ADD Role nvarchar(10) default 'TEACHER';

ALTER TABLE Student
ADD Role nvarchar(10) default 'STUDENT';

ALTER TABLE Teacher
ADD Address nvarchar(max);

ALTER TABLE Semester
ADD CreatedBy NVARCHAR(50);



ALTER TABLE Semester
ADD CONSTRAINT fk_Semester_Teacher
  FOREIGN KEY (CreatedBy)
  REFERENCES Teacher (UserName);

ALTER TABLE Semester
ADD IsDelete int Default 0;

ALTER TABLE Semester
ADD CreatedAt DATETIME DEFAULT GETDATE();

ALTER TABLE ScheduleSemester
ADD Implementer NVARCHAR(200);

ALTER TABLE ScheduleSemester
ADD Content NVARCHAR(max);

ALTER TABLE ScheduleSemester
ADD Note NVARCHAR(max);

ALTER TABLE Project add StatusProject nvarchar(50) DEFAULT 'START';

--ALTER TABLE Project
--DROP CONSTRAINT DF__Project__StatusP__70DDC3D8

select * from Teaching

insert Semester(SemesterId,NameSemester,FromDate,ToDate) values('1_2024_2025',N'Học kỳ 1 Năm 2024-2025',DATEFROMPARTS(2024, 01, 01),DATEFROMPARTS(2024, 06, 25));
insert Semester(SemesterId,NameSemester,FromDate,ToDate) values('2_2024_2025',N'Học kỳ 2 Năm 2024-2025',DATEFROMPARTS(2024, 06, 25),DATEFROMPARTS(2024, 12,01));

insert Classification(TypeCode,Code,Value,Role) values('ROLE_SYSTEM','STUDENT',N'Sinh viên','ADMIN')
insert Classification(TypeCode,Code,Value,Role) values('ROLE_SYSTEM','TEACHER',N'Giảng viên','ADMIN')
insert Classification(TypeCode,Code,Value,Role) values('ROLE_SYSTEM','ADMIN',N'Quản trị viên','ADMIN')

insert Classification(TypeCode,Code,Value,Role) values('STATUS_SYSTEM','AUTH',N'Hoạt dộng','ADMIN')
insert Classification(TypeCode,Code,Value,Role) values('STATUS_SYSTEM','BLOCK',N'Đã khóa','ADMIN')

insert Classification(TypeCode,Code,Value,Role) values('STATUS_PROJECT','PAUSE',N'Bảo lưu','ADMIN')
insert Classification(TypeCode,Code,Value,Role) values('STATUS_PROJECT','DOING',N'Đang làm đồ án','ADMIN')
insert Classification(TypeCode,Code,Value,Role) values('STATUS_PROJECT','ACCEPT',N'Được bảo vệ','ADMIN')
insert Classification(TypeCode,Code,Value,Role) values('STATUS_PROJECT','REJECT',N'Không được bảo vệ','ADMIN')
insert Classification(TypeCode,Code,Value,Role) values('STATUS_PROJECT','START',N'Mới tạo','ADMIN')

insert Classification(TypeCode,Code,Value,Role) values('TEMPLATE_FILE','REVIEW_MENTOR',N'Biểu mẫu đánh giá của giảng viên hướng dẫn','ADMIN')
insert Classification(TypeCode,Code,Value,Role) values('TEMPLATE_FILE','REVIEW_COMMENTATOR',N'Biểu mẫu đánh giá của giảng viên phản biện','ADMIN')
insert Classification(TypeCode,Code,Value,Role) values('TEMPLATE_FILE','OUTLINE',N'Biểu mẫu đề cương đồ án','ADMIN')

insert Classification(TypeCode,Code,Value,Role) values('TYPE_SCHEDULE','SCHEDULE_NORMAL',N'Lịch thông báo','ADMIN')
insert Classification(TypeCode,Code,Value,Role) values('TYPE_SCHEDULE','SCHEDULE_FOR_OUTLINE',N'Lịch chốt đề cương','ADMIN')
insert Classification(TypeCode,Code,Value,Role) values('TYPE_SCHEDULE','SCHEDULE_FOR_MENTOR',N'Chốt điểm GVHD','ADMIN')
insert Classification(TypeCode,Code,Value,Role) values('TYPE_SCHEDULE','SCHEDULE_FOR_COMMENTATOR',N'Chốt điểm GVPB','ADMIN')
insert Classification(TypeCode,Code,Value,Role) values('TYPE_SCHEDULE','SCHEDULE_FINAL_FILE',N'Nộp báo cáo cuối cùng','ADMIN')
insert Classification(TypeCode,Code,Value,Role) values('TYPE_SCHEDULE','SCHEDULE_FINAL_SCORE',N'Chốt điểm tổng kết','ADMIN')

select * from Classification

insert Major(MajorId,MajorName) values('CNPM',N'Công nghệ phần mềm')
insert Major(MajorId,MajorName) values('AI',N'Trí tuệ nhân tạo')
insert Major(MajorId,MajorName) values('GAME',N'Lập trình game')
insert Major(MajorId,MajorName) values('KHMT',N'Khoa học máy tính')
insert Major(MajorId,MajorName) values('MANG',N'Mạng và HTTT')

insert Education(EducationId,EducationName,MaxStudentMentor) values('KS',N'Kỹ sư',3)
insert Education(EducationId,EducationName,MaxStudentMentor) values('ThS',N'Thạc sĩ',5)
insert Education(EducationId,EducationName,MaxStudentMentor) values('TS',N'Tiến sĩ',7)


select * from student where GPA is not null;

Select * from Project
select * from teacher where IsDelete = 0

select count(*) from student where IsDelete = 0;



select * from ScheduleSemester

select Semester.SemesterId, Teacher.FullName as CreatedByName, Semester.NameSemester, Semester.ToDate, Semester.FromDate,Semester.CreatedAt,
	count(Project.SemesterId) as Total_Project, 
	COUNT(CASE WHEN Project.StatusProject = 'DOING' THEN Project.SemesterId END) AS Doing_Project,
	COUNT(CASE WHEN Project.StatusProject = 'REJECT' THEN Project.SemesterId END) AS Reject_Project,
	COUNT(CASE WHEN Project.StatusProject = 'ACCEPT' THEN Project.SemesterId END) AS Accept_Project,
	COUNT(CASE WHEN Project.StatusProject = 'PAUSE' THEN Project.SemesterId END) AS Pause_Project,
	AVG(ISNULL(Project.ScoreFinal, 0)) AS Average_Score
	from Semester 
	join Teacher on Semester.CreatedBy = Teacher.UserName
	left join Project on Project.SemesterId = Semester.SemesterId
	group by Semester.SemesterId, Teacher.FullName, Semester.NameSemester, Semester.ToDate, Semester.FromDate,Semester.CreatedAt
;


Update Project set SemesterId = '2_2025_2026' where UserName = '1_2024_2025_BeThanhNam_201210242'

select * from Project where SemesterId = '2_2025_2026'

select * from ScheduleSemester where ScheduleSemesterId = 'A0DF09E1-0B7C-441D-9977-8E19B8C80076'
select * from Teacher

select * from Semester;
select * from Project;

select * from ScheduleSemester


select *  from Teaching
select * from Teacher
select * from ProjectOutline
select * from Project
select * from Comment

delete from Semester where SemesterId = '1_2025_2026'

select * from GroupReviewOutline

select GroupReviewOutline.GroupReviewOutlineId,GroupReviewOutline.NameGroupReviewOutline,
count(Teaching.UserNameTeacher) as SLGV,
t1.SLSV
from GroupReviewOutline left join Teaching  on 
	Teaching.GroupReviewOutlineId = GroupReviewOutline.GroupReviewOutlineId
	join (
		select GroupReviewOutline.GroupReviewOutlineId,count(Project.UserName) as SLSV from GroupReviewOutline 
		left join ProjectOutline on ProjectOutline.GroupReviewOutlineId = GroupReviewOutline.GroupReviewOutlineId
		left join Project on Project.UserName = ProjectOutline.UserName
		where GroupReviewOutline.IsDelete = 0 and ( Project.SemesterId = '1_2025_2026' or Project.SemesterId is null)
		group by GroupReviewOutline.GroupReviewOutlineId
	) t1 on t1.GroupReviewOutlineId = GroupReviewOutline.GroupReviewOutlineId
where GroupReviewOutline.IsDelete = 0 and (Teaching.SemesterId = '1_2025_2026' or Teaching.SemesterId is null) 
group by GroupReviewOutline.GroupReviewOutlineId,GroupReviewOutline.NameGroupReviewOutline,t1.SLSV
	
	select * from GroupReviewOutline 
		left join ProjectOutline on ProjectOutline.GroupReviewOutlineId = GroupReviewOutline.GroupReviewOutlineId
		left join Project on Project.UserName = ProjectOutline.UserName
		where GroupReviewOutline.IsDelete = 0
		group by GroupReviewOutline.GroupReviewOutlineId
	
	select * from Project
	
	select * from Semester
	 
	select Teaching.GroupReviewOutlineId,count(*) from Teaching where semesterId = '2_2024_2025' group by Teaching.GroupReviewOutlineId

	select * from GroupReviewOutline left join Teaching  on 
	Teaching.GroupReviewOutlineId = GroupReviewOutline.GroupReviewOutlineId
	
	select * from Semester

INSERT INTO Teaching (UserNameTeacher, SemesterId)
SELECT UserName, '1_2024_2025'
FROM Teacher where IsDelete = 0

select * from Teaching where SemesterId = '2_2024_2025';
/*
update Teaching set GroupReviewOutlineId = 'NX2' where UserNameTeacher = 'HoangvanThong_191' and SemesterId = '1_2024_2025'
update Teaching set GroupReviewOutlineId = 'NX1' where UserNameTeacher = 'NguyenHieuCuong_1010101011' and SemesterId = '1_2024_2025'
update Teaching set GroupReviewOutlineId = 'NX4' where UserNameTeacher = 'NguyenHieucuong_1212211' and SemesterId = '1_2024_2025'
update Teaching set GroupReviewOutlineId = 'NX3' where UserNameTeacher = 'NguyenHieucuong_1212212' and SemesterId = '1_2024_2025'
update Teaching set GroupReviewOutlineId = 'NX3' where UserNameTeacher = 'NguyenHieucuong_1212213' and SemesterId = '1_2024_2025'
update Teaching set GroupReviewOutlineId = 'NX2' where UserNameTeacher = 'NguyenHieucuong_1212214' and SemesterId = '1_2024_2025'
update Teaching set GroupReviewOutlineId = 'NX1' where UserNameTeacher = 'NguyenHieucuong_1212215' and SemesterId = '1_2024_2025'
update Teaching set GroupReviewOutlineId = 'NX4' where UserNameTeacher = 'NguyenHieucuong_1212216' and SemesterId = '1_2024_2025'
update Teaching set GroupReviewOutlineId = 'NX3' where UserNameTeacher = 'NguyenHieucuong_1212217' and SemesterId = '1_2024_2025'
update Teaching set GroupReviewOutlineId = 'NX2' where UserNameTeacher = 'NguyenHieucuong_1212218' and SemesterId = '1_2024_2025'
update Teaching set GroupReviewOutlineId = 'NX1' where UserNameTeacher = 'NguyenHieucuong_1212219' and SemesterId = '1_2024_2025'
*/

update Project set UserNameMentor = 'NguyenHieuCuong_1010101011' where UserName = '2_2024_2025_BeThanhNam_201210242'
--2_2024_2025_NguyenCongChinh_201210044
select * from Project
select * from ProjectOutline
select * from Student
INSERT INTO ProjectOutline (UserName)
SELECT UserName
FROM Project
WHERE UserName <> '1_2024_2025_BeThanhNam_201210242' 
and UserName <> '1_2024_2025_BuiDucDuy_201200062' 
and UserName <> '2_2024_2025_BeThanhNam_201210242' 
and UserName <> '2_2024_2025_DaoDucTung_201210402'
and UserName <> '2_2024_2025_NguyenCongChinh_201210044';

select * from ProjectOutline
select * from Student where UserName = '1_2024_2025_LeQuangViet_201240414'

select UserName from Student where UserName = '2_2024_2025_VuTruongPhuoc_201200279'
union
select UserName from Teacher where UserName = '2_2024_2025_VuTruongPhuoc_201200279'

update Project set ScoreFinal = null

select * from ScheduleSemester
select * from Teacher
select * from Student
select * from ProjectOutline where UserName = '1_2024_2025_TranMinhDuc_201210096'
select * from Project where UserName = '1_2024_2025_TranMinhDuc_201210096'
delete from ProjectOutline where UserName = '1_2024_2025_TranMinhDuc_201210096'

select * from  GroupReviewOutline
select * from Council

select GroupReviewOutline.GroupReviewOutlineId,GroupReviewOutline.NameGroupReviewOutline,count(ProjectOutline.UserName) as TongSV
from 
GroupReviewOutline left join ProjectOutline on GroupReviewOutline.GroupReviewOutlineId = ProjectOutline.GroupReviewOutlineId
where GroupReviewOutline.IsDelete = 0
group by GroupReviewOutline.GroupReviewOutlineId,GroupReviewOutline.NameGroupReviewOutline
union
select GroupReviewOutline.GroupReviewOutlineId,GroupReviewOutline.NameGroupReviewOutline,count(Teaching.UserNameTeacher) as TongGV from GroupReviewOutline
left join Teaching on Teaching.GroupReviewOutlineId = GroupReviewOutline.GroupReviewOutlineId
where GroupReviewOutline.IsDelete = 0
group by GroupReviewOutline.GroupReviewOutlineId,GroupReviewOutline.NameGroupReviewOutline

select * from Teaching where SemesterId = '1_2024_2025'
select * from Semester 
select * from Project where CouncilId is not null

select * from Council
select * from GroupReviewOutline
select * from ProjectOutline
select * from Project where username = '1_2024_2025_201210096'
select * from Classification

update Project set UserNameMentorRegister = 'hoangvanthong' WHERE UserName IN (
    SELECT UserName
    FROM ProjectOutline
);

update Student set IsFirstTime = 1

update Student set IsFirstTime = 0 WHERE UserName IN (
    SELECT UserName
    FROM ProjectOutline
);


update Teaching set PositionInCouncil = null
update Teaching set CouncilId = null

select * from Major

select * from Project where username = '1_2024_2025_201210096'
select * from Teacher 
select * from Student where username = '1_2024_2025_201207797'
select * from ProjectOutline where username = '1_2024_2025_201207797'
select * from Student where username = '1_2024_2025_201210096'
select * from ProjectOutline where username = '1_2024_2025_201200309'
select PlantOutline from ProjectOutline where username = '1_2024_2025_201210096'


update Project set HashKeyCommentator = NEWID() where username = '1_2024_2025_201210096';
select * from Major
select * from Council

select * from GroupReviewOutline where semesterId = '1_2024_2025'
select * from ProjectOutline
select * from Student

update Student set MajorId = (select MajorId from Major)
select * from Student where UserName = '1_2023_2024_191212552'

select * from Major

UPDATE Student
SET MajorId = 
    CASE ABS(CHECKSUM(NEWID())) % 6
        WHEN 0 THEN 'GAME'
        WHEN 1 THEN 'AI'
        WHEN 2 THEN 'CNPM'
		WHEN 3 THEN 'KHMT'
		WHEN 4 THEN 'MANG'
		WHEN 5 THEN 'TESTER'
		ELSE 'CNPM'
    END

UPDATE Student
SET UserNameMentorRegister = 
    CASE ABS(CHECKSUM(NEWID())) % 15
        WHEN 1 THEN 'caothiluyen'
        WHEN 2 THEN 'daolethuy'
		WHEN 3 THEN 'dinhcongtung'
		WHEN 4 THEN 'dovanduc'
		WHEN 5 THEN 'hoangvanthong'
		WHEN 6 THEN 'laimanhdung'
		WHEN 7 THEN 'luongthaile'
		WHEN 8 THEN 'nguyenhieucuong'
		WHEN 9 THEN 'nguyenkimsao'
		WHEN 10 THEN 'nguyenquoctuan'
		WHEN 11 THEN 'nguyentranhieu'
		WHEN 12 THEN 'nguyentrongphuc'
		WHEN 13 THEN 'nguyenviethung'
		WHEN 14 THEN 'phamdinhphong'
		WHEN 15 THEN 'vuhuan'
		ELSE 'nguyenhieucuong'
    END

	select * from Teacher

	select * from Student where UserName = '1_2024_2025_201210096'

select * from Teaching left join Teacher on Teaching.UserNameTeacher = Teacher.UserName where semesterId = '1_2024_2025'

select * from Teacher where Teacher.UserName not in (select UserNameTeacher from Teaching where semesterId = '1_2024_2025')
select * from Teacher
select * from Semester where semesterId = '1_2024_2025'

update Teaching set GroupReviewOutlineId = null
update ProjectOutline set GroupReviewOutlineId = null


select * from Project where semesterId = '1_2024_2025' and UserNameMentor is not null

update Council set CouncilName = N'Hội đồng 1' where CouncilId = 'C1DC0880-B0A9-4385-BA07-9066A966B50B'

select * from Education 
update Education set MaxStudentMentor = 50 where EducationId = 'TS'
update Education set MaxStudentMentor = 30 where EducationId = 'KS'
update Education set MaxStudentMentor = 40 where EducationId = 'ThS'
update Education set MaxStudentMentor = 60 where EducationId = 'PGS'

select * from ScheduleSemester
-- tạo thêm trường file ở bảng ScheduleSemester để lưu file final của đồ án
select Student.UserName,Student.GPA,Student.UserNameMentorRegister, Project.UserNameMentor from Student join Project on Student.UserName = Project.UserName where Project.SemesterId = '1_2024_2025' order by Student.GPA desc
select * from Teaching where SemesterId = '1_2023_2024'
select * from Council

select * from Teaching where CouncilId = 'AE742ADF-178A-446E-B543-B27B2F5976C8'


select UserName,UserNameMentor,UserNameCommentator, CouncilId from Project where SemesterId = '1_2024_2025'


select * from GroupReviewOutline

update Project set CouncilId = null

select CouncilId from Teaching where UserNameTeacher in (
select UserNameMentor from Project where CouncilId = 'AE742ADF-178A-446E-B543-B27B2F5976C8' group by UserNameMentor
) and SemesterId = '1_2024_2025'

select Student.FullName,UserNameCommentator,CouncilId from Project join Student on Project.UserName = Student.UserName where Student.Status = 'AUTH' and Project.SemesterId = '1_2024_2025' and Project.CouncilId is not null

--INSERT INTO ProjectOutline (column1, column2, ...)
--SELECT column1, column2, ...
--FROM source_table
--WHERE conditions;

INSERT INTO ProjectOutline(UserName) 
SELECT UserName
FROM Project
WHERE UserName not in ('1_2024_2025_191200132','1_2024_2025_201200309','1_2024_2025_201207797','1_2024_2025_201210096');

select * from ScheduleSemester
select * from Project where SemesterId = '1_2024_2025'

update Teaching set CouncilId = null;
update Teaching set PositionInCouncil = null;

select * from Teacher
select * from Project where UserName = '1_2024_2025_201210096'

