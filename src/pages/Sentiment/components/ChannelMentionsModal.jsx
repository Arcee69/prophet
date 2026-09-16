import { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { IoClose } from 'react-icons/io5';
import ModalPop from '../../../components/modalPop';
import MentionCard from './MentionCard';

const TONE_STYLES = {
    positive: { dot: '#1E5631', badge: 'bg-[#DCFCE7] text-[#1E5631]' },
    neutral: { dot: '#BFBFBF', badge: 'bg-[#E5E7EB] text-[#4B5563]' },
    negative: { dot: '#FF4E4C', badge: 'bg-[#FFA8A8] text-[#B91C1C]' },
};

// Lists the mentions behind one segment of the "Sentiment Breakdown by Channel" chart,
// e.g. every positive News mention for the brand in view.
const ChannelMentionsModal = ({ selection, brand, onClose }) => {
    const isOpen = Boolean(selection);
    const { channel, tone } = selection || {};

    // Strongest first: most positive scores for positive, most negative for negative.
    const mentions = useMemo(() => {
        if (!channel) return [];
        const matches = channel.scoredMentions.filter(m => m.tone === tone);
        if (tone === 'positive') return matches.sort((a, b) => b.sentiment - a.sentiment);
        if (tone === 'negative') return matches.sort((a, b) => a.sentiment - b.sentiment);
        return matches;
    }, [channel, tone]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (event) => { if (event.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const style = TONE_STYLES[tone];

    return (
        <ModalPop isOpen={isOpen} closeModal={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className='bg-[#F9FAFB] rounded-[18px] w-full max-w-[960px] max-h-full my-auto flex flex-col overflow-hidden shadow-lg'
            >
                <div className='flex items-start justify-between gap-4 p-5 bg-white border-b border-[#E5E7EB]'>
                    <div className='flex flex-col gap-1'>
                        <div className='flex items-center gap-2'>
                            <span className='w-3 h-3 rounded-full' style={{ backgroundColor: style.dot }}></span>
                            <p className='font-jost font-medium text-[20px] text-[#1F2937]'>
                                {channel.label} · <span className='capitalize'>{tone}</span> mentions
                            </p>
                        </div>
                        <p className='font-jost text-sm text-[#6B7280]'>
                            {mentions.length.toLocaleString()} {tone} {mentions.length === 1 ? 'mention' : 'mentions'} of {brand}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label='Close'
                        className='p-2 rounded-lg hover:bg-gray-100 text-[#4B5563]'
                    >
                        <IoClose className='w-6 h-6' />
                    </button>
                </div>

                <div className='overflow-y-auto p-5 flex flex-col gap-4'>
                    {!channel.fromItems && (
                        <p className={`font-jost text-xs rounded-lg px-3 py-2 ${style.badge}`}>
                            The chart split for {channel.label} comes from the channel average score, as
                            too few mentions carry an individual score. Only the individually scored
                            mentions are listed here.
                        </p>
                    )}

                    {mentions.length > 0 ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {mentions.map((mention, index) => (
                                <MentionCard key={mention.url || index} mention={mention} />
                            ))}
                        </div>
                    ) : (
                        <div className='flex items-center justify-center h-[160px]'>
                            <p className='font-jost text-lg text-[#6B7280]'>
                                No {tone} {channel.label} mentions to show
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </ModalPop>
    );
};

ChannelMentionsModal.propTypes = {
    selection: PropTypes.shape({
        channel: PropTypes.object.isRequired,
        tone: PropTypes.oneOf(['positive', 'neutral', 'negative']).isRequired,
    }),
    brand: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};

export default ChannelMentionsModal;
