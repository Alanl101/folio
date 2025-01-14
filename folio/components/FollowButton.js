'use client';

import { useState } from 'react';

import { pb } from 'components/UserAuthentication';

const FollowButton = (props) => {
  const user = pb.authStore.model;
  const [loading, setLoading] = useState(false);
  
  async function unfollow() {
    setLoading(true);
    const records = await pb.collection('connections').getList(1, 100, /* batch size */ {
        filter: `follows = "${user.id}" && followed = "${props.followId}"`
    });
    await pb.collection('connections').delete(records.items[0].id);
    props.onUnfollow();
    setLoading(false);
  }

  async function follow() {
    setLoading(true);
    const record = await pb.collection('connections').getList(1, 100, /* batch size */ {
        filter: `follows = "${user.id}" && followed = "${props.followId}"`,
    });
    if (record.items.length === 0) {
      await pb.collection('connections').create({
        'follows': props.userId,
        'followed': props.followId,
      });
      props.onFollow();
    }
    setLoading(false);
  }

  return (
    <button onClick={() => {props.following && props.match || props.cardType === 'following'? unfollow() : follow()}} className={'border-2 w-32 bg-blue-500 mt-2 rounded-full hover:from-pink-500 hover:bg-blue-600 text-white'} disabled={loading}>
        {loading ? 'Processing...' : (props.following && props.match || props.cardType === 'following' ? 'Unfollow' : 'Follow')}
    </button>
  );
}

export default FollowButton;