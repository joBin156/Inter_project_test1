CREATE DATABASE gsdd_personnel_tracking

-- Users table
create table Users (
	Id int primary key identity(1,1),
	_default BIT NOT NULL,
	first_name varchar(255) NOT NULL,
	last_name varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	pin varchar(255) NOT NULL,
	position varchar(50) NOT NULL,
	verified BIT NOT NULL,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL,
	role varchar(10) NOT NULL,
	email_token varchar(255) NOT NULL,
)

-- Time In and Time Out table

create table TimeInAndOuts(
	Id int primary key identity(1,1),
	user_Id int foreign key REFERENCES Users(Id),
	time_in DATETIME,
	time_out DATETIME,
	total_time varchar(100),
    createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL,
)
	
-- Status table
create table Statuses(
	Id int primary key identity(1,1),
	user_Id int foreign key REFERENCES Users(Id),
	status varchar(100),
	date_and_time DATETIME,
    createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL,
)
	
-- StatusValue
create table StatusValues (
	Id int primary key identity(1,1),
	label varchar(255) NOT NULL,
	value varchar(255) NOT NULL,
)