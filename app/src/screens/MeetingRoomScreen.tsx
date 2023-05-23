import React from 'react'
import VideoCallMeeting from './meetings/VideoCallMeeting'
import AudioCallMeeting from './meetings/AudioCallMeeting'

const MeetingRoomScreen = ({ appointment_id, is_video }: { appointment_id: number, is_video: boolean }) => {

  if (is_video) {
    return <VideoCallMeeting appointment_id={appointment_id} />
  } else {
    return <AudioCallMeeting appointment_id={appointment_id} />
  }
}

export default MeetingRoomScreen