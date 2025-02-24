import { useState } from 'react';
import axios from 'axios';

export function usePost({ id, likes, comments, onLike, onComment, currentFunding, businessDetails, onInvest, onCrowdfund, userSub }) {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showCrowdfundModal, setShowCrowdfundModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [crowdfundAmount, setCrowdfundAmount] = useState('');
  const [selectedReward, setSelectedReward] = useState(null);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const rewards = [
    { amount: 50, title: 'Early Supporter', description: 'Get exclusive updates and behind-the-scenes content' },
    { amount: 200, title: 'Premium Backer', description: 'Early access to the product + exclusive updates' },
    { amount: 500, title: 'VIP Supporter', description: 'All previous rewards + personalized thank you video' },
  ];

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(comment);
      setComment('');
    }
  };

  const handleInvest = async (e) => {
    e.preventDefault();
    const amount = parseFloat(investmentAmount);
    if (amount > 0) {
      setError(null);
      try {
        await onInvest(id, amount);
        setShowInvestModal(false);
        setInvestmentAmount('');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleCrowdfund = async (e) => {
    e.preventDefault();
    const amount = parseFloat(crowdfundAmount);
    if (amount > 0) {
      setError(null);
      try {
        await onCrowdfund(id, amount);
        setShowCrowdfundModal(false);
        setCrowdfundAmount('');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${businessDetails.title} on FundHive!`;
    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`);
        break;
      default:
        break;
    }
    setShowShareModal(false);
  };

  const handleAIAnalysis = async (cibilScore) => {
    setAnalysisLoading(true);
    setError(null);
    setShowAnalysisModal(true);

    const prompt = `Generate a business analysis score (out of 100) and a pointwise business analysis report for the following idea:\n\nTitle: ${businessDetails.title}\nFunding Goal: $${businessDetails.fundingGoal}\nEquity Offered: ${businessDetails.equityOffered}%\nCurrent Funding: $${currentFunding}\nCIBIL Score: ${cibilScore}`;

    try {
      const response = await axios.post(
        'https://api.groq.com/v1/chat/completions', // Grok API endpoint
        {
          model: 'mixtral-8x7b-32768', // Example model; adjust as per Grok documentation
          messages: [
            { role: 'user', content: prompt }
          ],
          max_tokens: 500,
        },
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`, // Use environment variable
            'Content-Type': 'application/json',
          },
        }
      );

      // Parse the response
      const analysisText = response.data.choices[0].message.content;
      const scoreMatch = analysisText.match(/Score: (\d+)/);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 75; // Default to 75 if not found
      const reportLines = analysisText.split('\n').filter(line => line.trim().startsWith('-')).map(line => line.trim().substring(1).trim());

      setAnalysisResult({
        score,
        report: reportLines.length > 0 ? reportLines : ['No detailed analysis provided by AI.']
      });
    } catch (err) {
      setError('Failed to fetch AI analysis: ' + err.message);
      // Mock response for fallback (remove in production)
      setAnalysisResult({
        score: 75,
        report: [
          'Strong funding progress indicates market interest.',
          'CIBIL score suggests good financial reliability.',
          'Equity offered is competitive but may dilute control.',
          'Consider diversifying funding sources for stability.',
        ],
      });
    } finally {
      setAnalysisLoading(false);
    }
  };

  const progressPercentage = Math.min((currentFunding / businessDetails.fundingGoal) * 100, 100);

  return {
    showComments,
    setShowComments,
    comment,
    setComment,
    showInvestModal,
    setShowInvestModal,
    showCrowdfundModal,
    setShowCrowdfundModal,
    showShareModal,
    setShowShareModal,
    showAnalysisModal,
    setShowAnalysisModal,
    investmentAmount,
    setInvestmentAmount,
    crowdfundAmount,
    setCrowdfundAmount,
    selectedReward,
    setSelectedReward,
    error,
    rewards,
    analysisResult,
    analysisLoading,
    handleCommentSubmit,
    handleInvest,
    handleCrowdfund,
    handleShare,
    handleAIAnalysis,
    progressPercentage,
  };
}