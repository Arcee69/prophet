import PropTypes from 'prop-types';
import { IoLocationOutline } from 'react-icons/io5';

const formatNumber = (num) => {
    const value = Number(num) || 0;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return `${Math.round(value)}`;
};

const formatDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? null
        : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

// A single mention card, shared by the Feeds list and the channel breakdown modal.
const MentionCard = ({ mention }) => (
    <div className='bg-[#fff] h-auto flex items-start gap-3 px-[22px] py-[22px] rounded-lg'>
        {
            mention.type === 'Youtube' ?
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" alt={mention.type} className='w-[32px] h-[32px]' />
                :
                mention.type === 'Twitter' ?
                    <img width="48" height="48" src="https://img.icons8.com/fluency/48/twitterx--v1.png" alt="twitterx--v1" />
                    :
                    <div className='w-[32px] h-[32px] flex items-center justify-center rounded-full bg-[#10B981] p-2'>
                        <p className='text-white font-jost font-semibold'>N</p>
                    </div>
        }
        <div className='flex gap-3 flex-col w-full'>
            <div className='flex flex-col mt-1 gap-1'>
                <div className='flex items-center justify-between gap-2'>
                    <p className='font-jost text-sm text-[#000000]'>{mention.type}</p>
                    {formatDate(mention.publishedAt) && (
                        <p className='font-jost text-xs text-[#9CA3AF]'>
                            {formatDate(mention.publishedAt)}
                        </p>
                    )}
                </div>
            </div>

            {mention.type === "Youtube" && (
                <a href={mention.url} target="_blank" rel="noopener noreferrer">
                    <img
                        src={`https://img.youtube.com/vi/${mention.id || new URL(mention.url).searchParams.get("v")}/hqdefault.jpg`}
                        alt={mention.title || "YouTube Thumbnail"}
                        className="w-full h-[200px] object-cover rounded-md"
                    />
                </a>
            )}

            <a
                href={mention.url}
                target="_blank"
                rel="noopener noreferrer"
                className='font-jost font-semibold text-base text-[#1F2937] hover:text-[#F48A1F] leading-snug'
            >
                {mention.title || mention.url}
            </a>

            {mention.description && (
                <p className='font-jost text-sm text-[#6B7280] leading-relaxed'>
                    {mention.description}
                </p>
            )}

            {(mention.views > 0 || mention.likes > 0 || mention.comments > 0) && (
                <div className='flex items-center gap-4 font-jost text-xs text-[#9CA3AF]'>
                    {mention.views > 0 && <span>{formatNumber(mention.views)} views</span>}
                    {mention.likes > 0 && <span>{formatNumber(mention.likes)} likes</span>}
                    {mention.comments > 0 && <span>{formatNumber(mention.comments)} comments</span>}
                </div>
            )}

            <div className='flex items-center gap-3 flex-wrap'>
                {mention.sentiment !== null && mention.sentiment !== undefined && (
                    <div className={`rounded-full px-3 py-1 ${mention.tone === 'positive' ? 'bg-[#DCFCE7]' : mention.tone === 'negative' ? 'bg-[#FFA8A8]' : 'bg-[#E5E7EB]'}`}>
                        <p className={`text-xs text-center font-inter capitalize ${mention.tone === 'positive' ? 'text-[#1E5631]' : mention.tone === 'negative' ? 'text-[#B91C1C]' : 'text-[#4B5563]'}`}>
                            {mention.tone} ({mention.sentiment.toFixed(2)})
                        </p>
                    </div>
                )}
                {mention.location && (
                    <span className='flex items-center gap-1 font-jost text-xs text-[#4B5563] bg-[#F9FAFB] border border-[#E5E7EB] rounded-full px-3 py-1'>
                        <IoLocationOutline className='w-3.5 h-3.5 text-[#F48A1F]' />
                        {mention.location}
                    </span>
                )}
                {mention.brands?.length > 1 && (
                    <span className='font-jost text-xs text-[#6B7280] bg-[#F9FAFB] border border-[#E5E7EB] rounded-full px-3 py-1'>
                        {mention.brands.join(' & ')}
                    </span>
                )}
                <a href={mention.url} target="_blank" rel="noopener noreferrer" className='font-jost text-[#F48A1F] text-sm'>Details</a>
            </div>
        </div>
    </div>
);

MentionCard.propTypes = {
    mention: PropTypes.object.isRequired,
};

export default MentionCard;
