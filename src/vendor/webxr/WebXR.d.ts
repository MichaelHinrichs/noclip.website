/*
 * Copyright 2020 Babylon.js authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Navigator, XRSystem and XRView added by fordacious.

interface Navigator {
    xr: XRSystem;
}

interface XRSystem extends EventTarget {
    isSessionSupported(mode: XRSessionMode): Promise<boolean>;
    requestSession(mode: XRSessionMode, options?: XRSessionInit): Promise<XRSession>;
}

type XRSessionMode =
    | "inline"
    | "immersive-vr"
    | "immersive-ar";

type XRReferenceSpaceType =
    | "viewer"
    | "local"
    | "local-floor"
    | "bounded-floor"
    | "unbounded";

type XREnvironmentBlendMode =
    | "opaque"
    | "additive"
    | "alpha-blend";

type XRVisibilityState =
    | "visible"
    | "visible-blurred"
    | "hidden";

type XRHandedness =
    | "none"
    | "left"
    | "right";

type XRTargetRayMode =
    | "gaze"
    | "tracked-pointer"
    | "screen";

type XREye =
    | "none"
    | "left"
    | "right";

interface XRSpace extends EventTarget {

}

interface XRRenderState {
    depthNear?: number;
    depthFar?: number;
    inlineVerticalFieldOfView?: number;
    baseLayer?: XRWebGLLayer;
}

interface XRInputSource {
    handedness: XRHandedness;
    targetRayMode: XRTargetRayMode;
    targetRaySpace: XRSpace;
    gripSpace: XRSpace | undefined;
    gamepad: Gamepad | undefined;
    profiles: Array<string>;
}

interface XRSessionInit {
    optionalFeatures?: XRReferenceSpaceType[];
    requiredFeatures?: XRReferenceSpaceType[];
}

interface XRSession extends XRAnchorCreator {
    addEventListener: Function;
    removeEventListener: Function;
    requestReferenceSpace(type: XRReferenceSpaceType): Promise<XRReferenceSpace>;
    updateRenderState(XRRenderStateInit: XRRenderState): Promise<void>;
    requestAnimationFrame: Function;
    end(): Promise<void>;
    renderState: XRRenderState;
    inputSources: Array<XRInputSource>;

    // AR hit test
    requestHitTest(ray: XRRay, referenceSpace: XRReferenceSpace): Promise<XRHitResult[]>;

    updateWorldTrackingState(options: {
        planeDetectionState?: { enabled: boolean; }
    }): void;
}

interface XRReferenceSpace extends XRSpace {
    getOffsetReferenceSpace(originOffset: XRRigidTransform): XRReferenceSpace;
    onreset: any;
}

type XRPlaneSet = Set<XRPlane>;
type XRAnchorSet = Set<XRAnchor>;

interface XRFrame {
    session: XRSession;
    getViewerPose(referenceSpace: XRReferenceSpace): XRViewerPose | undefined;
    getPose(space: XRSpace, baseSpace: XRSpace): XRPose | undefined;

    // Anchors
    trackedAnchors?: XRAnchorSet;
    // Planes
    worldInformation: {
        detectedPlanes?: XRPlaneSet;
    };
}

interface XRViewerPose extends XRPose {
    views: Array<XRView>;
}

interface XRPose {
    transform: XRRigidTransform;
    emulatedPosition: boolean;
}

interface XRWebGLLayerOptions {
    antialias?: boolean;
    depth?: boolean;
    stencil?: boolean;
    alpha?: boolean;
    multiview?: boolean;
    framebufferScaleFactor?: number;
}

declare var XRWebGLLayer: {
    prototype: XRWebGLLayer;
    new(session: XRSession, context: WebGLRenderingContext | undefined, options?: XRWebGLLayerOptions): XRWebGLLayer;
};
interface XRWebGLLayer {
    framebuffer: WebGLFramebuffer;
    framebufferWidth: number;
    framebufferHeight: number;
    getViewport: Function;
}

declare class XRRigidTransform {
    constructor(matrix: Float32Array | DOMPointInit, direction?: DOMPointInit);
    position: DOMPointReadOnly;
    orientation: DOMPointReadOnly;
    matrix: Float32Array;
    inverse: XRRigidTransform;
}

interface XRView {
    eye: XREye;
    projectionMatrix: Float32Array;
    transform: XRRigidTransform;
}

interface XRViewport {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface XRInputSourceChangeEvent {
    session: XRSession;
    removed: Array<XRInputSource>;
    added: Array<XRInputSource>;
}

interface XRInputSourceEvent extends Event {
    readonly frame: XRFrame;
    readonly inputSource: XRInputSource;
}

// Experimental(er) features
declare class XRRay {
    constructor(transformOrOrigin: XRRigidTransform | DOMPointInit, direction?: DOMPointInit);
    origin: DOMPointReadOnly;
    direction: DOMPointReadOnly;
    matrix: Float32Array;
}

interface XRHitResult {
    hitMatrix: Float32Array;
}

interface XRAnchor {
    // remove?
    id?: string;
    anchorSpace: XRSpace;
    lastChangedTime: number;
    detach(): void;
}

interface XRPlane extends XRAnchorCreator {
    orientation: "Horizontal" | "Vertical";
    planeSpace: XRSpace;
    polygon: Array<DOMPointReadOnly>;
    lastChangedTime: number;
}

interface XRAnchorCreator {
    // AR Anchors
    createAnchor(pose: XRPose | XRRigidTransform, referenceSpace: XRReferenceSpace): Promise<XRAnchor>;
}