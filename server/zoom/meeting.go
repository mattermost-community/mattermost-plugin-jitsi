package zoom

import (
	"fmt"
)

const (
	MEETING_TYPE_INSTANT = 1
)

// The Meeting object defined at https://zoom.github.io/api/#the-meeting-object.
type Meeting struct {
	ID         int         `json:"id"`
	Topic      string      `json:"topic"`
	Type       int         `json:"type"`
	StartTime  string      `json:"start_time"`
	Duration   int         `json:"duration"`
	Timezone   string      `json:"timezone"`
	Password   string      `json:"password"`
	Agenda     string      `json:"agenda"`
	Recurrence *Recurrence `json:"recurrence"`
	Settings   *Settings   `json:"settings"`
}

type Recurrence struct {
	Type           int    `json:"type"`
	RepeatInterval int    `json:"repeat_interval"`
	WeeklyDays     int    `json:"weekly_days"`
	MonthlyDay     int    `json:"monthly_day"`
	MonthlyWeek    int    `json:"monthly_week"`
	MonthlyWeekDay int    `json:"monthly_week_day"`
	EndTimes       int    `json:"end_times"`
	EndDateTime    string `json:"end_date_time"`
}

type Settings struct {
	HostVideo           bool   `json:"host_video"`
	ParticipantVideo    bool   `json:"participant_video"`
	CnMeeting           bool   `json:"cn_meeting"`
	InMeeting           bool   `json:"in_meeting"`
	JoinBeforeHost      bool   `json:"join_before_host"`
	MuteUponEntry       bool   `json:"mute_upon_entry"`
	Watermark           bool   `json:"watermark"`
	UsePmi              bool   `json:"use_pmi"`
	ApprovalType        int    `json:"approval_type"`
	RegistrationType    int    `json:"registration_type"`
	Audio               string `json:"audio"`
	AutoRecording       string `json:"auto_recording"`
	EnforceLogin        bool   `json:"enforce_login"`
	EnforceLoginDomains string `json:"enforce_login_domains"`
	AlternativeHosts    string `json:"alternative_hosts"`
}

func (c *Client) CreateMeeting(meeting *Meeting, userId string) (*Meeting, *ClientError) {
	var ret Meeting
	return &ret, c.request("POST", fmt.Sprintf("/users/%v/meetings", userId), meeting, &ret)
}
