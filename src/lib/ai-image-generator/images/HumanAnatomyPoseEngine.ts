import crypto from 'crypto';
import { HumanAnatomyPoseDecision } from './human-anatomy-pose.types';

export class HumanAnatomyPoseEngine {
  public static resolve(input: {
    primarySubject?: string;
    action?: string;
    content?: string;
  }): HumanAnatomyPoseDecision {
    const text = `${input.action || ''} ${input.content || ''}`.toLowerCase();

    let bodyOrientation: 'front_facing_34' | 'profile_side' | 'seated_ergonomic' | 'standing_presenting' = 'front_facing_34';
    let poseIntent = 'Professional three-quarter angle standing stance with relaxed posture';
    let leftHand = 'Resting naturally at side with clear 5-finger separation';
    let rightHand = 'Gesturing subtly toward primary interface with clear 5-finger separation';

    if (text.includes('seated') || text.includes('desk') || text.includes('coding') || text.includes('typing')) {
      bodyOrientation = 'seated_ergonomic';
      poseIntent = 'Ergonomic seated position with straight spinal alignment';
      leftHand = 'Positioned on keyboard home row with 5 distinct fingers visible';
      rightHand = 'Resting on ergonomic mouse with 5 distinct fingers visible';
    } else if (text.includes('presenting') || text.includes('speech') || text.includes('whiteboard')) {
      bodyOrientation = 'standing_presenting';
      poseIntent = 'Confident upright standing presentation posture';
      rightHand = 'Extended open-palm gesture toward screen display';
    }

    const anatomicalConstraints = [
      'Strict 5 fingers per hand requirement',
      'Exact 2 arms and 2 legs attached to torso',
      'Natural cervical neck curvature without unnatural twisting',
      'Zero joint hyperextension beyond normal anatomical limits (elbows <= 180deg, knees <= 180deg)',
    ];

    const prohibitedMalformedBodyNegativePrompts = [
      'extra fingers',
      'fused fingers',
      'malformed hands',
      'missing limbs',
      'extra arms',
      'extra legs',
      'floating limbs',
      'twisted spine',
      'mutated anatomy',
      'distorted face',
    ];

    const anatomyRiskWarnings: string[] = [];
    if (text.includes('6 fingers') || text.includes('extra hand')) {
      anatomyRiskWarnings.push('Anatomy risk rejected: Text prompt requested malformed anatomical feature.');
    }

    const isAnatomicallySound = anatomyRiskWarnings.length === 0;

    const payload = `${bodyOrientation}|${poseIntent}|${leftHand}|${rightHand}`;
    const deterministicFingerprint = crypto.createHash('sha256').update(payload).digest('hex');

    return {
      poseIntent,
      bodyOrientation,
      limbVisibility: 'Both upper limbs and torso clearly visible in frame without phantom clipping',
      handPlacement: {
        leftHand,
        rightHand,
        explicitFiveFingersRequired: true,
      },
      anatomicalConstraints,
      interactionPosture: 'Natural biomechanically achievable posture matching real human ergonomics',
      motionPlausibility: 'Static stable posture with zero motion blur artifacts',
      occlusionAwareAnatomyRules: 'Limb occlusion behind torso handled cleanly without phantom extra limbs',
      prohibitedMalformedBodyNegativePrompts,
      isAnatomicallySound,
      anatomyRiskWarnings: isAnatomicallySound ? undefined : anatomyRiskWarnings,
      deterministicFingerprint,
    };
  }
}
