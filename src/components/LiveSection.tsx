import React from 'react';
import { Radio, Plus, Video, Calendar, Users, Bell } from 'lucide-react';
import { Meeting } from '../types';

interface LiveSectionProps {
  meetings: Meeting[];
  onOpenCreateMeeting: () => void;
  onJoinMeeting: (meeting: Meeting) => void;
  onSetReminder: (meetingTitle: string) => void;
  language?: string;
}

export const LiveSection: React.FC<LiveSectionProps> = ({
  meetings,
  onOpenCreateMeeting,
  onJoinMeeting,
  onSetReminder,
  language,
}) => {
  const isSwahili = language === 'Swahili';
  const liveRoom = meetings.find((m) => m.isLiveNow) || meetings[0];
  const upcomingMeetings = meetings.filter((m) => !m.isLiveNow);

  return (
    <section id="live" className="py-12 max-w-6xl mx-auto px-4 border-t border-emerald-950/10 dark:border-emerald-500/15">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-emerald-50 tracking-tight font-editorial">
            {isSwahili ? 'Mikutano Mubashara & Video' : 'Live & Video Conferencing'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/70 mt-1">
            {isSwahili
              ? 'Kutana, fundisha, jadili na ungana kupitia video ya moja kwa moja.'
              : 'Meet, teach, discuss and connect through live video.'}
          </p>
        </div>

        <button
          onClick={onOpenCreateMeeting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-700/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {isSwahili ? 'Unda Mkutano' : 'Create Meeting'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Main Live Room Spotlight */}
        {liveRoom && (
          <div className="lg:col-span-3 relative rounded-3xl overflow-hidden min-h-[340px] flex flex-col justify-end p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/40 to-black/20 text-white shadow-[0_0_22px_rgba(5,150,105,0.35)] border border-[#ffd700]/40">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-[#ffd700] to-emerald-500/20 shadow-[0_0_10px_rgba(5,150,105,0.4)] z-10" />
            <img
              src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80"
              alt="Live conference room"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay -z-10"
            />

            {/* Live Indicator Badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-md tracking-wider">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                {isSwahili ? 'MUBASHARA SASA' : 'LIVE NOW'}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-black/70 backdrop-blur-xs text-[#ffd700] border border-[#ffd700]/30 shadow-xs">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                {liveRoom.participantsCount} {isSwahili ? 'Wanaotazama' : 'Watching'}
              </span>
            </div>

            <div className="relative z-10">
              <span className="text-xs font-bold text-[#ffd700] uppercase tracking-wider block mb-1">
                {isSwahili ? 'Matangazo Maalum ya Moja kwa Moja' : 'Featured Live Broadcast'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black mb-2 text-white leading-tight font-editorial">
                {isSwahili && liveRoom.titleSwahili ? liveRoom.titleSwahili : liveRoom.title}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 max-w-lg mb-5">
                {isSwahili
                  ? 'Jiunge na kipindi mubashara na Ev Dr. Boniphace J. Ndege. Uliza maswali na shirikiana na jamii.'
                  : 'Join the live interactive stream with Ev Dr. Boniphace J. Ndege. Ask questions and participate in community dialogue.'}
              </p>

              <div>
                <button
                  onClick={() => onJoinMeeting(liveRoom)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black bg-gradient-to-r from-[#ffd700] via-[#f5d061] to-[#d4af37] text-slate-950 shadow-[0_0_16px_rgba(255,215,0,0.4)] transition-all hover:scale-102 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  {isSwahili ? 'Jiunge na Chumba Mubashara' : 'Join Live Room'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Meetings List */}
        <div className="lg:col-span-2 card-neon-gold p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/10 via-[#ffd700]/60 to-emerald-500/10 mb-4 rounded-full" />
            <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#ffd700]" />
                {isSwahili ? 'Mikutano Inayokuja' : 'Upcoming Meetings'}
              </span>
              <span className="text-xs text-[#ffd700] font-bold">
                {isSwahili ? 'Ratiba' : 'Schedule'}
              </span>
            </h3>

            <div className="divide-y divide-emerald-950/10 dark:divide-emerald-500/15">
              {upcomingMeetings.map((meet) => (
                <div key={meet.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <strong className="text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-50 block leading-tight">
                      {isSwahili && meet.titleSwahili ? meet.titleSwahili : meet.title}
                    </strong>
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-emerald-400/60">
                    {isSwahili && meet.scheduleSwahili ? meet.scheduleSwahili : meet.schedule} · {isSwahili ? 'Mwezeshaji' : 'Host'}: {meet.hostName}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onSetReminder(meet.title)}
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-emerald-950/60 text-slate-700 dark:text-emerald-200 hover:bg-slate-200 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      {isSwahili ? 'Weka Kikumbusho' : 'Set Reminder'}
                    </button>
                    <button
                      onClick={() => onJoinMeeting(meet)}
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-600/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      {isSwahili ? 'Jiunge' : 'Join'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
