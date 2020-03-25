from datetime import date, timedelta
from .constants import JANUARY, FEBRUARY, MARCH, APRIL, MAY,\
    JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER

def one_week_ago():
    return str(date.today() - timedelta(days=7))


def six_days_ago():
    return date.today() - timedelta(days=6)


def one_day_ago():
    return str(date.today() - timedelta(days=1))


def month_to_num(month):
    if month == JANUARY:
        return 1
    elif month == FEBRUARY:
        return 2
    elif month == MARCH:
        return 3
    elif month == APRIL:
        return 4
    elif month == MAY:
        return 5
    elif month == JUNE:
        return 6
    elif month == JULY:
        return 7
    elif month == AUGUST:
        return 8
    elif month == SEPTEMBER:
        return 9
    elif month == OCTOBER:
        return 10
    elif month == NOVEMBER:
        return 11
    elif month == DECEMBER:
        return 12


def num_to_month(month):
    if month == 1:
        return JANUARY
    elif month == 2:
        return FEBRUARY
    elif month == 3:
        return MARCH
    elif month == 4:
        return APRIL
    elif month == 5:
        return MAY
    elif month == 6:
        return JUNE
    elif month == 7:
        return JULY
    elif month == 8:
        return  AUGUST
    elif month == 9:
        return SEPTEMBER
    elif month == 10:
        return OCTOBER
    elif month == 11:
        return NOVEMBER
    elif month == 12:
        return DECEMBER
