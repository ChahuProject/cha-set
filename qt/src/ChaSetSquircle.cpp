#include "ChaSetSquircle.h"

#include <QQuickWindow>
#include <QSGNode>
#include <QSGGeometryNode>
#include <QSGVertexColorMaterial>
#include <QSGGeometry>
#include <QtMath>
#include <algorithm>
#include <cmath>
#include <tuple>

ChaSetSquirclePen::ChaSetSquirclePen(QObject *parent)
    : QObject(parent)
{
}

void ChaSetSquirclePen::setWidth(qreal w)
{
    if (qFuzzyCompare(m_width, w))
        return;
    m_width = w;
    emit changed();
}

void ChaSetSquirclePen::setColor(const QColor &c)
{
    if (m_color == c)
        return;
    m_color = c;
    emit changed();
}

class ChaSetSquircleNode : public QSGGeometryNode
{
public:
    QSGVertexColorMaterial material;

    // 生成参数快照：参数未变时 updatePaintNode 直接短路，既不重算超椭圆多边形
    // （393 点 Bezier 采样），也不 markDirty 重传几何。网格里每帧回收上百张卡，
    // 大量卡片底色/半径/尺寸其实没变，逐卡全量重建是滚动帧时间的主因之一。
    struct Params {
        qreal w = 0, h = 0;
        qreal rTL = 0, rTR = 0, rBR = 0, rBL = 0;
        qreal smoothing = 0;
        bool preserveSmoothing = true;
        qreal penWidth = 0;
        QColor color;
        QColor penColor;
        bool tl = false, tr = false, br = false, bl = false;
        bool hasFill = false, hasBorder = false;
        bool isAA = false;
        qreal dpr = 1.0;

        static bool fuzzy(qreal a, qreal b) {
            return qFuzzyCompare(a + 1.0, b + 1.0);
        }
        bool operator==(const Params &o) const {
            return fuzzy(w, o.w) && fuzzy(h, o.h) && fuzzy(rTL, o.rTL) &&
                   fuzzy(rTR, o.rTR) && fuzzy(rBR, o.rBR) && fuzzy(rBL, o.rBL) &&
                   fuzzy(smoothing, o.smoothing) && preserveSmoothing == o.preserveSmoothing &&
                   fuzzy(penWidth, o.penWidth) && fuzzy(dpr, o.dpr) &&
                   color == o.color && penColor == o.penColor && tl == o.tl &&
                   tr == o.tr && br == o.br && bl == o.bl &&
                   hasFill == o.hasFill && hasBorder == o.hasBorder &&
                   isAA == o.isAA;
        }
    };
    Params cached;
    bool hasCache = false;

    ChaSetSquircleNode() {
        material.setFlag(QSGMaterial::Blending, true);
        setMaterial(&material);
        setFlag(OwnsGeometry, true);
    }
};

static QVector<QPointF> computeClockwiseNormals(const QVector<QPointF> &pts)
{
    const int N = pts.size();
    QVector<QPointF> normals(N);
    if (N < 3)
        return normals;

    QVector<QPointF> edgeNormals(N);
    bool hasValidEdge = false;
    for (int i = 0; i < N; ++i) {
        const int next = (i + 1 == N) ? 0 : (i + 1);
        const qreal dx = pts[next].x() - pts[i].x();
        const qreal dy = pts[next].y() - pts[i].y();
        const qreal len = std::hypot(dx, dy);
        if (len > 1e-6) {
            edgeNormals[i] = QPointF(dy / len, -dx / len);
            hasValidEdge = true;
        } else {
            edgeNormals[i] = QPointF(0, 0);
        }
    }

    if (!hasValidEdge) {
        normals.fill(QPointF(0, -1));
        return normals;
    }

    for (int i = 0; i < N; ++i) {
        // Find preceding valid edge normal (skip degenerate corner runs)
        int prev = (i == 0) ? (N - 1) : (i - 1);
        while (edgeNormals[prev].isNull() && prev != i) {
            prev = (prev == 0) ? (N - 1) : (prev - 1);
        }
        const QPointF n1 = edgeNormals[prev];

        // Find succeeding valid edge normal (skip degenerate corner runs)
        int curr = i;
        while (edgeNormals[curr].isNull()) {
            curr = (curr + 1 == N) ? 0 : (curr + 1);
            if (curr == i)
                break;
        }
        const QPointF n2 = edgeNormals[curr];

        const QPointF sum = n1 + n2;
        const qreal sumLen = std::hypot(sum.x(), sum.y());
        if (sumLen > 1e-6) {
            const QPointF u = sum / sumLen;
            const qreal dot = u.x() * n2.x() + u.y() * n2.y();
            const qreal miter = 1.0 / std::max(0.5, dot);
            normals[i] = u * std::min(2.0, miter);
        } else if (!n2.isNull()) {
            normals[i] = n2;
        } else {
            normals[i] = QPointF(0, -1);
        }
    }

    return normals;
}

ChaSetSquircle::ChaSetSquircle(QQuickItem *parent)
    : QQuickItem(parent)
{
    setFlag(ItemHasContents, true);
    setAntialiasing(true);

    connect(&m_pen, &ChaSetSquirclePen::changed, this, [this]() {
        update();
    });
}

void ChaSetSquircle::geometryChange(const QRectF &newGeometry, const QRectF &oldGeometry)
{
    QQuickItem::geometryChange(newGeometry, oldGeometry);
    if (newGeometry.size() != oldGeometry.size()) {
        update();
    }
}

void ChaSetSquircle::setColor(const QColor &c)
{
    if (m_color == c)
        return;
    m_color = c;
    emit colorChanged();
    update();
}

void ChaSetSquircle::setRadius(qreal r)
{
    if (qFuzzyCompare(m_radius, r))
        return;
    m_radius = r;
    emit radiusChanged();
    update();
}

void ChaSetSquircle::setTopLeftRadius(qreal r)
{
    if (qFuzzyCompare(m_topLeftRadius, r))
        return;
    m_topLeftRadius = r;
    emit topLeftRadiusChanged();
    update();
}

void ChaSetSquircle::setTopRightRadius(qreal r)
{
    if (qFuzzyCompare(m_topRightRadius, r))
        return;
    m_topRightRadius = r;
    emit topRightRadiusChanged();
    update();
}

void ChaSetSquircle::setBottomLeftRadius(qreal r)
{
    if (qFuzzyCompare(m_bottomLeftRadius, r))
        return;
    m_bottomLeftRadius = r;
    emit bottomLeftRadiusChanged();
    update();
}

void ChaSetSquircle::setBottomRightRadius(qreal r)
{
    if (qFuzzyCompare(m_bottomRightRadius, r))
        return;
    m_bottomRightRadius = r;
    emit bottomRightRadiusChanged();
    update();
}

void ChaSetSquircle::setCornerSmoothing(qreal s)
{
    if (qFuzzyCompare(m_cornerSmoothing, s))
        return;
    m_cornerSmoothing = s;
    emit cornerSmoothingChanged();
    update();
}

void ChaSetSquircle::setRoundLeft(bool v)
{
    if (m_roundLeft == v)
        return;
    m_roundLeft = v;
    emit roundLeftChanged();
    update();
}

void ChaSetSquircle::setRoundRight(bool v)
{
    if (m_roundRight == v)
        return;
    m_roundRight = v;
    emit roundRightChanged();
    update();
}

void ChaSetSquircle::setRoundTop(bool v)
{
    if (m_roundTop == v)
        return;
    m_roundTop = v;
    emit roundTopChanged();
    update();
}

void ChaSetSquircle::setRoundBottom(bool v)
{
    if (m_roundBottom == v)
        return;
    m_roundBottom = v;
    emit roundBottomChanged();
    update();
}

void ChaSetSquircle::setRoundTopLeft(bool v)
{
    if (m_roundTopLeft == v)
        return;
    m_roundTopLeft = v;
    emit roundTopLeftChanged();
    update();
}

void ChaSetSquircle::setRoundTopRight(bool v)
{
    if (m_roundTopRight == v)
        return;
    m_roundTopRight = v;
    emit roundTopRightChanged();
    update();
}

void ChaSetSquircle::setRoundBottomLeft(bool v)
{
    if (m_roundBottomLeft == v)
        return;
    m_roundBottomLeft = v;
    emit roundBottomLeftChanged();
    update();
}

void ChaSetSquircle::setRoundBottomRight(bool v)
{
    if (m_roundBottomRight == v)
        return;
    m_roundBottomRight = v;
    emit roundBottomRightChanged();
    update();
}

void ChaSetSquircle::setPreserveSmoothing(bool v)
{
    if (m_preserveSmoothing == v)
        return;
    m_preserveSmoothing = v;
    emit preserveSmoothingChanged();
    update();
}

struct CornerMath {
    qreal p = 0.0;
    qreal a = 0.0;
    qreal b = 0.0;
    qreal c = 0.0;
    qreal d = 0.0;
    qreal theta = 0.0; // in radians
    qreal beta = 0.0;  // in radians
    qreal k = 0.0;     // arc cubic factor
    qreal r = 0.0;
};

static CornerMath calcCorner(qreal radius, qreal s, qreal shortest_l, bool preserveSmoothing = true)
{
    CornerMath m;
    const qreal budget = shortest_l / 2.0;
    m.r = std::max(0.0, std::min(radius, budget));
    if (m.r <= 0.001)
        return m;

    s = std::clamp(s, 0.0, 1.0);
    m.p = (1.0 + s) * m.r;

    if (!preserveSmoothing) {
        qreal max_s = std::max(0.0, budget / m.r - 1.0);
        s = std::min(s, max_s);
        m.p = std::min(m.p, budget);
    }

    qreal angle_beta_deg = 90.0 * (1.0 - s);
    qreal angle_alpha_deg = 45.0 * s;
    qreal angle_theta_deg = (90.0 - angle_beta_deg) / 2.0;

    m.theta = qDegreesToRadians(angle_theta_deg);
    m.beta = qDegreesToRadians(angle_beta_deg);
    qreal alpha = qDegreesToRadians(angle_alpha_deg);

    qreal d_div_c = std::tan(alpha);
    qreal h_longest = m.r * std::tan(m.theta / 2.0);
    qreal l = std::sin(m.beta / 2.0) * m.r * M_SQRT2;
    m.c = h_longest * std::cos(alpha);
    m.d = m.c * d_div_c;
    m.b = ((m.p - l) - (1.0 + d_div_c) * m.c) / 3.0;
    m.a = 2.0 * m.b;

    if (preserveSmoothing && m.p > budget) {
        qreal maxDist = budget - m.d - l - m.c;
        qreal minA = maxDist / 6.0;
        qreal maxB = maxDist - minA;
        m.b = std::min(m.b, maxB);
        m.a = maxDist - m.b;
        m.p = budget;
    }

    m.k = m.beta > 0.0001 ? (4.0 / 3.0) * std::tan(m.beta / 4.0) : 0.0;

    return m;
}

static inline QPointF evalCubic(const QPointF &p0, const QPointF &p1, const QPointF &p2, const QPointF &p3, qreal t)
{
    const qreal u = 1.0 - t;
    const qreal tt = t * t;
    const qreal uu = u * u;
    const qreal uuu = uu * u;
    const qreal ttt = tt * t;
    return uuu * p0 + 3.0 * uu * t * p1 + 3.0 * u * tt * p2 + ttt * p3;
}

static inline void sampleCubic(QVector<QPointF> &pts, const QPointF &p0, const QPointF &p1, const QPointF &p2, const QPointF &p3, int steps)
{
    for (int i = 1; i <= steps; ++i) {
        qreal t = static_cast<qreal>(i) / steps;
        pts.append(evalCubic(p0, p1, p2, p3, t));
    }
}

// 半径退化（≤ 0.001）的圆角必须占用与真实圆角完全相同的顶点数，
// 否则内外轮廓顶点数不一致，描边成环时无法逐点配对（会越界访问）。
// 退化的三个贝塞尔段全部塌缩到同一个角点，几何上等价于零半径尖角。
static inline void appendDegenerateCorner(QVector<QPointF> &pts, const QPointF &corner, int stepsPerSegment)
{
    pts.append(corner);
    pts.insert(pts.end(), 3 * stepsPerSegment, corner);
}

QVector<QPointF> ChaSetSquircle::generateSquirclePolygon(
    const QRectF &rect,
    qreal rTL, qreal rTR, qreal rBR, qreal rBL,
    qreal smoothing,
    bool tl, bool tr, bool br, bool bl,
    int stepsPerSegment,
    bool preserveSmoothing)
{
    QVector<QPointF> pts;
    const qreal W = rect.width();
    const qreal H = rect.height();
    const qreal X = rect.x();
    const qreal Y = rect.y();

    if (W <= 0.0 || H <= 0.0)
        return pts;

    const qreal shortest_l = std::min(W, H);
    CornerMath mTL = (tl && rTL > 0.001) ? calcCorner(rTL, smoothing, shortest_l, preserveSmoothing) : CornerMath{};
    CornerMath mTR = (tr && rTR > 0.001) ? calcCorner(rTR, smoothing, shortest_l, preserveSmoothing) : CornerMath{};
    CornerMath mBR = (br && rBR > 0.001) ? calcCorner(rBR, smoothing, shortest_l, preserveSmoothing) : CornerMath{};
    CornerMath mBL = (bl && rBL > 0.001) ? calcCorner(rBL, smoothing, shortest_l, preserveSmoothing) : CornerMath{};

    pts.reserve(256);

    // 1. Top Edge -> Top-Right Corner
    if (mTR.r <= 0.001) {
        appendDegenerateCorner(pts, QPointF(X + W, Y), stepsPerSegment);
    } else {
        pts.append(QPointF(X + W - mTR.p, Y));
        // Segment 1
        QPointF p0(X + W - mTR.p, Y);
        QPointF p1(X + W - (mTR.p - mTR.a), Y);
        QPointF p2(X + W - (mTR.p - mTR.a - mTR.b), Y);
        QPointF p3(X + W - (mTR.p - mTR.a - mTR.b - mTR.c), Y + mTR.d);
        sampleCubic(pts, p0, p1, p2, p3, stepsPerSegment);

        // Segment 2 (Arc)
        qreal cp1x = (X + W - (mTR.p - mTR.a - mTR.b - mTR.c)) + mTR.k * mTR.r * std::cos(mTR.theta);
        qreal cp1y = (Y + mTR.d) + mTR.k * mTR.r * std::sin(mTR.theta);
        qreal cp2x = (X + W - mTR.d) - mTR.k * mTR.r * std::sin(mTR.theta);
        qreal cp2y = (Y + mTR.p - mTR.a - mTR.b - mTR.c) - mTR.k * mTR.r * std::cos(mTR.theta);
        QPointF pArcEnd(X + W - mTR.d, Y + mTR.p - mTR.a - mTR.b - mTR.c);
        sampleCubic(pts, p3, QPointF(cp1x, cp1y), QPointF(cp2x, cp2y), pArcEnd, stepsPerSegment);

        // Segment 3
        QPointF p4(X + W, Y + mTR.p - mTR.a - mTR.b);
        QPointF p5(X + W, Y + mTR.p - mTR.a);
        QPointF p6(X + W, Y + mTR.p);
        sampleCubic(pts, pArcEnd, p4, p5, p6, stepsPerSegment);
    }

    // 2. Right Edge -> Bottom-Right Corner
    if (mBR.r <= 0.001) {
        appendDegenerateCorner(pts, QPointF(X + W, Y + H), stepsPerSegment);
    } else {
        pts.append(QPointF(X + W, Y + H - mBR.p));
        // Segment 1
        QPointF p0(X + W, Y + H - mBR.p);
        QPointF p1(X + W, Y + H - (mBR.p - mBR.a));
        QPointF p2(X + W, Y + H - (mBR.p - mBR.a - mBR.b));
        QPointF p3(X + W - mBR.d, Y + H - (mBR.p - mBR.a - mBR.b - mBR.c));
        sampleCubic(pts, p0, p1, p2, p3, stepsPerSegment);

        // Segment 2 (Arc)
        qreal cp1x = (X + W - mBR.d) - mBR.k * mBR.r * std::sin(mBR.theta);
        qreal cp1y = (Y + H - (mBR.p - mBR.a - mBR.b - mBR.c)) + mBR.k * mBR.r * std::cos(mBR.theta);
        qreal cp2x = (X + W - (mBR.p - mBR.a - mBR.b - mBR.c)) + mBR.k * mBR.r * std::cos(mBR.theta);
        qreal cp2y = (Y + H - mBR.d) - mBR.k * mBR.r * std::sin(mBR.theta);
        QPointF pArcEnd(X + W - (mBR.p - mBR.a - mBR.b - mBR.c), Y + H - mBR.d);
        sampleCubic(pts, p3, QPointF(cp1x, cp1y), QPointF(cp2x, cp2y), pArcEnd, stepsPerSegment);

        // Segment 3
        QPointF p4(X + W - (mBR.p - mBR.a - mBR.b), Y + H);
        QPointF p5(X + W - (mBR.p - mBR.a), Y + H);
        QPointF p6(X + W - mBR.p, Y + H);
        sampleCubic(pts, pArcEnd, p4, p5, p6, stepsPerSegment);
    }

    // 3. Bottom Edge -> Bottom-Left Corner
    if (mBL.r <= 0.001) {
        appendDegenerateCorner(pts, QPointF(X, Y + H), stepsPerSegment);
    } else {
        pts.append(QPointF(X + mBL.p, Y + H));
        // Segment 1
        QPointF p0(X + mBL.p, Y + H);
        QPointF p1(X + (mBL.p - mBL.a), Y + H);
        QPointF p2(X + (mBL.p - mBL.a - mBL.b), Y + H);
        QPointF p3(X + (mBL.p - mBL.a - mBL.b - mBL.c), Y + H - mBL.d);
        sampleCubic(pts, p0, p1, p2, p3, stepsPerSegment);

        // Segment 2 (Arc)
        qreal cp1x = (X + (mBL.p - mBL.a - mBL.b - mBL.c)) - mBL.k * mBL.r * std::cos(mBL.theta);
        qreal cp1y = (Y + H - mBL.d) - mBL.k * mBL.r * std::sin(mBL.theta);
        qreal cp2x = (X + mBL.d) + mBL.k * mBL.r * std::sin(mBL.theta);
        qreal cp2y = (Y + H - (mBL.p - mBL.a - mBL.b - mBL.c)) + mBL.k * mBL.r * std::cos(mBL.theta);
        QPointF pArcEnd(X + mBL.d, Y + H - (mBL.p - mBL.a - mBL.b - mBL.c));
        sampleCubic(pts, p3, QPointF(cp1x, cp1y), QPointF(cp2x, cp2y), pArcEnd, stepsPerSegment);

        // Segment 3
        QPointF p4(X, Y + H - (mBL.p - mBL.a - mBL.b));
        QPointF p5(X, Y + H - (mBL.p - mBL.a));
        QPointF p6(X, Y + H - mBL.p);
        sampleCubic(pts, pArcEnd, p4, p5, p6, stepsPerSegment);
    }

    // 4. Left Edge -> Top-Left Corner
    if (mTL.r <= 0.001) {
        appendDegenerateCorner(pts, QPointF(X, Y), stepsPerSegment);
    } else {
        pts.append(QPointF(X, Y + mTL.p));
        // Segment 1
        QPointF p0(X, Y + mTL.p);
        QPointF p1(X, Y + (mTL.p - mTL.a));
        QPointF p2(X, Y + (mTL.p - mTL.a - mTL.b));
        QPointF p3(X + mTL.d, Y + (mTL.p - mTL.a - mTL.b - mTL.c));
        sampleCubic(pts, p0, p1, p2, p3, stepsPerSegment);

        // Segment 2 (Arc)
        qreal cp1x = (X + mTL.d) + mTL.k * mTL.r * std::sin(mTL.theta);
        qreal cp1y = (Y + (mTL.p - mTL.a - mTL.b - mTL.c)) - mTL.k * mTL.r * std::cos(mTL.theta);
        qreal cp2x = (X + (mTL.p - mTL.a - mTL.b - mTL.c)) - mTL.k * mTL.r * std::cos(mTL.theta);
        qreal cp2y = (Y + mTL.d) + mTL.k * mTL.r * std::sin(mTL.theta);
        QPointF pArcEnd(X + (mTL.p - mTL.a - mTL.b - mTL.c), Y + mTL.d);
        sampleCubic(pts, p3, QPointF(cp1x, cp1y), QPointF(cp2x, cp2y), pArcEnd, stepsPerSegment);

        // Segment 3
        QPointF p4(X + (mTL.p - mTL.a - mTL.b), Y);
        QPointF p5(X + (mTL.p - mTL.a), Y);
        QPointF p6(X + mTL.p, Y);
        sampleCubic(pts, pArcEnd, p4, p5, p6, stepsPerSegment);
    }

    return pts;
}

QPainterPath ChaSetSquircle::createSquirclePath(
    const QRectF &rect,
    qreal rTL, qreal rTR, qreal rBR, qreal rBL,
    qreal smoothing,
    bool tl, bool tr, bool br, bool bl,
    bool preserveSmoothing)
{
    QPainterPath path;
    const qreal W = rect.width();
    const qreal H = rect.height();
    const qreal X = rect.x();
    const qreal Y = rect.y();

    if (W <= 0.0 || H <= 0.0)
        return path;

    const qreal shortest_l = std::min(W, H);

    CornerMath mTL = (tl && rTL > 0.001) ? calcCorner(rTL, smoothing, shortest_l, preserveSmoothing) : CornerMath{};
    CornerMath mTR = (tr && rTR > 0.001) ? calcCorner(rTR, smoothing, shortest_l, preserveSmoothing) : CornerMath{};
    CornerMath mBR = (br && rBR > 0.001) ? calcCorner(rBR, smoothing, shortest_l, preserveSmoothing) : CornerMath{};
    CornerMath mBL = (bl && rBL > 0.001) ? calcCorner(rBL, smoothing, shortest_l, preserveSmoothing) : CornerMath{};

    // Start at top edge center
    path.moveTo(X + W / 2.0, Y);

    // 1. Top Edge -> Top-Right Corner
    if (mTR.r <= 0.001) {
        path.lineTo(X + W, Y);
    } else {
        path.lineTo(X + W - mTR.p, Y);
        path.cubicTo(
            X + W - (mTR.p - mTR.a), Y,
            X + W - (mTR.p - mTR.a - mTR.b), Y,
            X + W - (mTR.p - mTR.a - mTR.b - mTR.c), Y + mTR.d
        );
        qreal cp1x = (X + W - (mTR.p - mTR.a - mTR.b - mTR.c)) + mTR.k * mTR.r * std::cos(mTR.theta);
        qreal cp1y = (Y + mTR.d) + mTR.k * mTR.r * std::sin(mTR.theta);
        qreal cp2x = (X + W - mTR.d) - mTR.k * mTR.r * std::sin(mTR.theta);
        qreal cp2y = (Y + mTR.p - mTR.a - mTR.b - mTR.c) - mTR.k * mTR.r * std::cos(mTR.theta);
        path.cubicTo(cp1x, cp1y, cp2x, cp2y, X + W - mTR.d, Y + mTR.p - mTR.a - mTR.b - mTR.c);
        path.cubicTo(
            X + W, Y + mTR.p - mTR.a - mTR.b,
            X + W, Y + mTR.p - mTR.a,
            X + W, Y + mTR.p
        );
    }

    // 2. Right Edge -> Bottom-Right Corner
    if (mBR.r <= 0.001) {
        path.lineTo(X + W, Y + H);
    } else {
        path.lineTo(X + W, Y + H - mBR.p);
        path.cubicTo(
            X + W, Y + H - (mBR.p - mBR.a),
            X + W, Y + H - (mBR.p - mBR.a - mBR.b),
            X + W - mBR.d, Y + H - (mBR.p - mBR.a - mBR.b - mBR.c)
        );
        qreal cp1x = (X + W - mBR.d) - mBR.k * mBR.r * std::sin(mBR.theta);
        qreal cp1y = (Y + H - (mBR.p - mBR.a - mBR.b - mBR.c)) + mBR.k * mBR.r * std::cos(mBR.theta);
        qreal cp2x = (X + W - (mBR.p - mBR.a - mBR.b - mBR.c)) + mBR.k * mBR.r * std::cos(mBR.theta);
        qreal cp2y = (Y + H - mBR.d) - mBR.k * mBR.r * std::sin(mBR.theta);
        path.cubicTo(cp1x, cp1y, cp2x, cp2y, X + W - (mBR.p - mBR.a - mBR.b - mBR.c), Y + H - mBR.d);
        path.cubicTo(
            X + W - (mBR.p - mBR.a - mBR.b), Y + H,
            X + W - (mBR.p - mBR.a), Y + H,
            X + W - mBR.p, Y + H
        );
    }

    // 3. Bottom Edge -> Bottom-Left Corner
    if (mBL.r <= 0.001) {
        path.lineTo(X, Y + H);
    } else {
        path.lineTo(X + mBL.p, Y + H);
        path.cubicTo(
            X + (mBL.p - mBL.a), Y + H,
            X + (mBL.p - mBL.a - mBL.b), Y + H,
            X + (mBL.p - mBL.a - mBL.b - mBL.c), Y + H - mBL.d
        );
        qreal cp1x = (X + (mBL.p - mBL.a - mBL.b - mBL.c)) - mBL.k * mBL.r * std::cos(mBL.theta);
        qreal cp1y = (Y + H - mBL.d) - mBL.k * mBL.r * std::sin(mBL.theta);
        qreal cp2x = (X + mBL.d) + mBL.k * mBL.r * std::sin(mBL.theta);
        qreal cp2y = (Y + H - (mBL.p - mBL.a - mBL.b - mBL.c)) + mBL.k * mBL.r * std::cos(mBL.theta);
        path.cubicTo(cp1x, cp1y, cp2x, cp2y, X + mBL.d, Y + H - (mBL.p - mBL.a - mBL.b - mBL.c));
        path.cubicTo(
            X, Y + H - (mBL.p - mBL.a - mBL.b),
            X, Y + H - (mBL.p - mBL.a),
            X, Y + H - mBL.p
        );
    }

    // 4. Left Edge -> Top-Left Corner
    if (mTL.r <= 0.001) {
        path.lineTo(X, Y);
    } else {
        path.lineTo(X, Y + mTL.p);
        path.cubicTo(
            X, Y + (mTL.p - mTL.a),
            X, Y + (mTL.p - mTL.a - mTL.b),
            X + mTL.d, Y + (mTL.p - mTL.a - mTL.b - mTL.c)
        );
        qreal cp1x = (X + mTL.d) + mTL.k * mTL.r * std::sin(mTL.theta);
        qreal cp1y = (Y + (mTL.p - mTL.a - mTL.b - mTL.c)) - mTL.k * mTL.r * std::cos(mTL.theta);
        qreal cp2x = (X + (mTL.p - mTL.a - mTL.b - mTL.c)) - mTL.k * mTL.r * std::cos(mTL.theta);
        qreal cp2y = (Y + mTL.d) + mTL.k * mTL.r * std::sin(mTL.theta);
        path.cubicTo(cp1x, cp1y, cp2x, cp2y, X + (mTL.p - mTL.a - mTL.b - mTL.c), Y + mTL.d);
        path.cubicTo(
            X + (mTL.p - mTL.a - mTL.b), Y,
            X + (mTL.p - mTL.a), Y,
            X + mTL.p, Y
        );
    }

    path.closeSubpath();
    return path;
}

QSGNode *ChaSetSquircle::updatePaintNode(QSGNode *oldNode, UpdatePaintNodeData *)
{
    const qreal W = width();
    const qreal H = height();
    if (W <= 0.0 || H <= 0.0) {
        delete oldNode;
        return nullptr;
    }

    const qreal bw = m_pen.width();
    const QColor bc = m_pen.color();
    const bool hasBorder = (bw > 0.0 && bc.alpha() > 0);
    const bool hasFill = (m_color.alpha() > 0);

    if (!hasFill && !hasBorder) {
        delete oldNode;
        return nullptr;
    }

    ChaSetSquircleNode *node = static_cast<ChaSetSquircleNode *>(oldNode);
    if (!node) {
        node = new ChaSetSquircleNode();
    }

    const qreal rTL = (m_topLeftRadius >= 0.0) ? m_topLeftRadius : m_radius;
    const qreal rTR = (m_topRightRadius >= 0.0) ? m_topRightRadius : m_radius;
    const qreal rBR = (m_bottomRightRadius >= 0.0) ? m_bottomRightRadius : m_radius;
    const qreal rBL = (m_bottomLeftRadius >= 0.0) ? m_bottomLeftRadius : m_radius;

    const bool tl = m_roundLeft && m_roundTop && m_roundTopLeft;
    const bool tr = m_roundRight && m_roundTop && m_roundTopRight;
    const bool br = m_roundRight && m_roundBottom && m_roundBottomRight;
    const bool bl = m_roundLeft && m_roundBottom && m_roundBottomLeft;
    const bool isAA = antialiasing();
    const qreal dpr = window() ? window()->devicePixelRatio() : 1.0;
    const qreal effectiveDpr = dpr > 0.0 ? dpr : 1.0;

    // 参数未变 → 直接复用旧节点：不重算多边形、不重写顶点、不 markDirty。
    // 这是滚动回收路径上最常见的分支（同尺寸卡片反复 rebind）。
    {
        ChaSetSquircleNode::Params p;
        p.w = W; p.h = H;
        p.rTL = rTL; p.rTR = rTR; p.rBR = rBR; p.rBL = rBL;
        p.smoothing = m_cornerSmoothing;
        p.preserveSmoothing = m_preserveSmoothing;
        p.penWidth = bw; p.color = m_color; p.penColor = bc;
        p.tl = tl; p.tr = tr; p.br = br; p.bl = bl;
        p.hasFill = hasFill; p.hasBorder = hasBorder;
        p.isAA = isAA;
        p.dpr = effectiveDpr;
        if (node->hasCache && node->cached == p)
            return node;
        node->cached = p;
        node->hasCache = true;
    }

    const int steps = 24;
    QRectF fillRect(0, 0, W, H);
    QVector<QPointF> outerPoints = generateSquirclePolygon(fillRect, rTL, rTR, rBR, rBL, m_cornerSmoothing, tl, tr, br, bl, steps, m_preserveSmoothing);
    const int N = outerPoints.size();
    if (N < 3) {
        delete node;
        return nullptr;
    }

    QVector<QPointF> outerNormals = computeClockwiseNormals(outerPoints);

    const qreal inset = bw;
    const bool actualBorder = hasBorder && (2.0 * inset < W && 2.0 * inset < H);
    const qreal f = isAA ? (0.5 / effectiveDpr) : 0.0;
    const bool isThinBorder = isAA && (bw <= 2.0 * f + 1e-4);

    const bool solid = !actualBorder;
    const QColor solidColor = hasFill ? m_color : bc;

    int numVerts = 0;
    int numIndices = 0;

    if (solid) {
        numVerts = (isAA ? (2 * N + 1) : (N + 1));
        numIndices = (isAA ? (9 * N) : (3 * N));
    } else if (hasFill) {
        numVerts = isAA ? (isThinBorder ? (3 * N + 1) : (4 * N + 1)) : (2 * N + 1);
        numIndices = isAA ? (isThinBorder ? (15 * N) : (21 * N)) : (9 * N);
    } else {
        numVerts = isAA ? (isThinBorder ? (3 * N) : (4 * N)) : (2 * N);
        numIndices = isAA ? (isThinBorder ? (12 * N) : (18 * N)) : (6 * N);
    }

    QSGGeometry *geom = node->geometry();
    if (!geom || geom->vertexCount() != numVerts || geom->indexCount() != numIndices) {
        geom = new QSGGeometry(QSGGeometry::defaultAttributes_ColoredPoint2D(), numVerts, numIndices);
        geom->setDrawingMode(QSGGeometry::DrawTriangles);
        node->setGeometry(geom);
    }

    QSGGeometry::ColoredPoint2D *v = geom->vertexDataAsColoredPoint2D();
    quint16 *indices = geom->indexDataAsUShort();

    int vertOffset = 0;
    int idxOffset = 0;

    auto makePremul = [](const QColor &c, float alphaMult = 1.0f) -> std::tuple<uchar, uchar, uchar, uchar> {
        const float a = std::clamp(static_cast<float>(c.alphaF()) * alphaMult, 0.0f, 1.0f);
        const uchar r = static_cast<uchar>(std::round(static_cast<float>(c.redF()) * a * 255.0f));
        const uchar g = static_cast<uchar>(std::round(static_cast<float>(c.greenF()) * a * 255.0f));
        const uchar b = static_cast<uchar>(std::round(static_cast<float>(c.blueF()) * a * 255.0f));
        const uchar na = static_cast<uchar>(std::round(a * 255.0f));
        return {r, g, b, na};
    };

    auto addQuad = [&](quint16 in1, quint16 out1, quint16 in2, quint16 out2) {
        indices[idxOffset++] = in1;
        indices[idxOffset++] = out1;
        indices[idxOffset++] = in2;

        indices[idxOffset++] = in2;
        indices[idxOffset++] = out1;
        indices[idxOffset++] = out2;
    };

    if (solid) {
        const auto [fr, fg, fb, fa] = makePremul(solidColor, 1.0f);
        const auto [zr, zg, zb, za] = makePremul(solidColor, 0.0f);

        const QPointF center(W / 2.0, H / 2.0);
        v[vertOffset + 0].set(static_cast<float>(center.x()), static_cast<float>(center.y()), fr, fg, fb, fa);

        const int coreBase = vertOffset + 1;
        for (int i = 0; i < N; ++i) {
            const QPointF pt = outerPoints[i] - f * outerNormals[i];
            v[coreBase + i].set(static_cast<float>(pt.x()), static_cast<float>(pt.y()), fr, fg, fb, fa);
        }

        for (int i = 0; i < N; ++i) {
            const quint16 c1 = static_cast<quint16>(coreBase + i);
            const quint16 c2 = static_cast<quint16>(coreBase + ((i + 1 == N) ? 0 : (i + 1)));
            indices[idxOffset++] = static_cast<quint16>(vertOffset + 0);
            indices[idxOffset++] = c1;
            indices[idxOffset++] = c2;
        }

        if (isAA) {
            const int fringeBase = coreBase + N;
            for (int i = 0; i < N; ++i) {
                const QPointF pt = outerPoints[i] + f * outerNormals[i];
                v[fringeBase + i].set(static_cast<float>(pt.x()), static_cast<float>(pt.y()), zr, zg, zb, za);
            }

            for (int i = 0; i < N; ++i) {
                const quint16 c1 = static_cast<quint16>(coreBase + i);
                const quint16 c2 = static_cast<quint16>(coreBase + ((i + 1 == N) ? 0 : (i + 1)));
                const quint16 o1 = static_cast<quint16>(fringeBase + i);
                const quint16 o2 = static_cast<quint16>(fringeBase + ((i + 1 == N) ? 0 : (i + 1)));
                addQuad(c1, o1, c2, o2);
            }
        }
    } else if (!hasFill) {
        // Outline stroke only
        const auto [br, bg, bb, ba] = makePremul(bc, 1.0f);
        const auto [zr, zg, zb, za] = makePremul(bc, 0.0f);

        if (!isAA) {
            const int outBase = vertOffset;
            const int inBase = outBase + N;
            for (int i = 0; i < N; ++i) {
                v[outBase + i].set(static_cast<float>(outerPoints[i].x()), static_cast<float>(outerPoints[i].y()), br, bg, bb, ba);
                const QPointF pIn = outerPoints[i] - bw * outerNormals[i];
                v[inBase + i].set(static_cast<float>(pIn.x()), static_cast<float>(pIn.y()), br, bg, bb, ba);
            }
            for (int i = 0; i < N; ++i) {
                const quint16 o1 = static_cast<quint16>(outBase + i);
                const quint16 o2 = static_cast<quint16>(outBase + ((i + 1 == N) ? 0 : (i + 1)));
                const quint16 i1 = static_cast<quint16>(inBase + i);
                const quint16 i2 = static_cast<quint16>(inBase + ((i + 1 == N) ? 0 : (i + 1)));
                addQuad(i1, o1, i2, o2);
            }
        } else if (isThinBorder) {
            // Thin stroke (bw <= 2f): outer fringe (0) -> center line (1) -> inner fringe (0)
            const int outFringeBase = vertOffset;
            const int centerBase = outFringeBase + N;
            const int inFringeBase = centerBase + N;

            for (int i = 0; i < N; ++i) {
                const QPointF pOutFr = outerPoints[i] + f * outerNormals[i];
                const QPointF pCenter = outerPoints[i] - 0.5 * bw * outerNormals[i];
                const QPointF pInFr = outerPoints[i] - (bw + f) * outerNormals[i];

                v[outFringeBase + i].set(static_cast<float>(pOutFr.x()), static_cast<float>(pOutFr.y()), zr, zg, zb, za);
                v[centerBase + i].set(static_cast<float>(pCenter.x()), static_cast<float>(pCenter.y()), br, bg, bb, ba);
                v[inFringeBase + i].set(static_cast<float>(pInFr.x()), static_cast<float>(pInFr.y()), zr, zg, zb, za);
            }

            for (int i = 0; i < N; ++i) {
                const quint16 oFr1 = static_cast<quint16>(outFringeBase + i);
                const quint16 oFr2 = static_cast<quint16>(outFringeBase + ((i + 1 == N) ? 0 : (i + 1)));
                const quint16 c1 = static_cast<quint16>(centerBase + i);
                const quint16 c2 = static_cast<quint16>(centerBase + ((i + 1 == N) ? 0 : (i + 1)));
                const quint16 iFr1 = static_cast<quint16>(inFringeBase + i);
                const quint16 iFr2 = static_cast<quint16>(inFringeBase + ((i + 1 == N) ? 0 : (i + 1)));

                // Outer fringe: center (alpha 1) to outer fringe (alpha 0)
                addQuad(c1, oFr1, c2, oFr2);
                // Inner fringe: inner fringe (alpha 0) to center (alpha 1)
                addQuad(iFr1, c1, iFr2, c2);
            }
        } else {
            // Thick stroke (bw > 2f): outer fringe (0) -> outer core (1) -> inner core (1) -> inner fringe (0)
            const int outFringeBase = vertOffset;
            const int outCoreBase = outFringeBase + N;
            const int inCoreBase = outCoreBase + N;
            const int inFringeBase = inCoreBase + N;

            for (int i = 0; i < N; ++i) {
                const QPointF pOutFr = outerPoints[i] + f * outerNormals[i];
                const QPointF pOutCo = outerPoints[i] - f * outerNormals[i];
                const QPointF pInCo = outerPoints[i] - (bw - f) * outerNormals[i];
                const QPointF pInFr = outerPoints[i] - (bw + f) * outerNormals[i];

                v[outFringeBase + i].set(static_cast<float>(pOutFr.x()), static_cast<float>(pOutFr.y()), zr, zg, zb, za);
                v[outCoreBase + i].set(static_cast<float>(pOutCo.x()), static_cast<float>(pOutCo.y()), br, bg, bb, ba);
                v[inCoreBase + i].set(static_cast<float>(pInCo.x()), static_cast<float>(pInCo.y()), br, bg, bb, ba);
                v[inFringeBase + i].set(static_cast<float>(pInFr.x()), static_cast<float>(pInFr.y()), zr, zg, zb, za);
            }

            for (int i = 0; i < N; ++i) {
                const quint16 oFr1 = static_cast<quint16>(outFringeBase + i);
                const quint16 oFr2 = static_cast<quint16>(outFringeBase + ((i + 1 == N) ? 0 : (i + 1)));
                const quint16 oCo1 = static_cast<quint16>(outCoreBase + i);
                const quint16 oCo2 = static_cast<quint16>(outCoreBase + ((i + 1 == N) ? 0 : (i + 1)));
                const quint16 iCo1 = static_cast<quint16>(inCoreBase + i);
                const quint16 iCo2 = static_cast<quint16>(inCoreBase + ((i + 1 == N) ? 0 : (i + 1)));
                const quint16 iFr1 = static_cast<quint16>(inFringeBase + i);
                const quint16 iFr2 = static_cast<quint16>(inFringeBase + ((i + 1 == N) ? 0 : (i + 1)));

                // Outer fringe
                addQuad(oCo1, oFr1, oCo2, oFr2);
                // Solid body
                addQuad(iCo1, oCo1, iCo2, oCo2);
                // Inner fringe
                addQuad(iFr1, iCo1, iFr2, iCo2);
            }
        }
    } else {
        // Both Fill and Border
        const auto [fr, fg, fb, fa] = makePremul(m_color, 1.0f);
        const auto [br, bg, bb, ba] = makePremul(bc, 1.0f);
        const auto [zr, zg, zb, za] = makePremul(bc, 0.0f);

        // 1. Center vertex
        const QPointF center(W / 2.0, H / 2.0);
        v[vertOffset + 0].set(static_cast<float>(center.x()), static_cast<float>(center.y()), fr, fg, fb, fa);

        const int fillBase = vertOffset + 1;

        if (!isAA) {
            const int outBase = fillBase + N;
            for (int i = 0; i < N; ++i) {
                const QPointF pFill = outerPoints[i] - bw * outerNormals[i];
                v[fillBase + i].set(static_cast<float>(pFill.x()), static_cast<float>(pFill.y()), fr, fg, fb, fa);
                v[outBase + i].set(static_cast<float>(outerPoints[i].x()), static_cast<float>(outerPoints[i].y()), br, bg, bb, ba);
            }
            for (int i = 0; i < N; ++i) {
                const quint16 c1 = static_cast<quint16>(fillBase + i);
                const quint16 c2 = static_cast<quint16>(fillBase + ((i + 1 == N) ? 0 : (i + 1)));
                indices[idxOffset++] = static_cast<quint16>(vertOffset + 0);
                indices[idxOffset++] = c1;
                indices[idxOffset++] = c2;
            }
            for (int i = 0; i < N; ++i) {
                const quint16 i1 = static_cast<quint16>(fillBase + i);
                const quint16 i2 = static_cast<quint16>(fillBase + ((i + 1 == N) ? 0 : (i + 1)));
                const quint16 o1 = static_cast<quint16>(outBase + i);
                const quint16 o2 = static_cast<quint16>(outBase + ((i + 1 == N) ? 0 : (i + 1)));
                addQuad(i1, o1, i2, o2);
            }
        } else if (isThinBorder) {
            // Fill + Thin border: center -> fill perimeter (m_color) -> mid border (bc) -> outer fringe (bc, alpha 0)
            const int borderMidBase = fillBase + N;
            const int outFringeBase = borderMidBase + N;

            for (int i = 0; i < N; ++i) {
                const QPointF pFill = outerPoints[i] - bw * outerNormals[i];
                const QPointF pMid = outerPoints[i] - 0.5 * bw * outerNormals[i];
                const QPointF pOutFr = outerPoints[i] + f * outerNormals[i];

                v[fillBase + i].set(static_cast<float>(pFill.x()), static_cast<float>(pFill.y()), fr, fg, fb, fa);
                v[borderMidBase + i].set(static_cast<float>(pMid.x()), static_cast<float>(pMid.y()), br, bg, bb, ba);
                v[outFringeBase + i].set(static_cast<float>(pOutFr.x()), static_cast<float>(pOutFr.y()), zr, zg, zb, za);
            }

            // Fill fan
            for (int i = 0; i < N; ++i) {
                const quint16 c1 = static_cast<quint16>(fillBase + i);
                const quint16 c2 = static_cast<quint16>(fillBase + ((i + 1 == N) ? 0 : (i + 1)));
                indices[idxOffset++] = static_cast<quint16>(vertOffset + 0);
                indices[idxOffset++] = c1;
                indices[idxOffset++] = c2;
            }

            // Inner transition band (fill -> border)
            for (int i = 0; i < N; ++i) {
                const quint16 f1 = static_cast<quint16>(fillBase + i);
                const quint16 f2 = static_cast<quint16>(fillBase + ((i + 1 == N) ? 0 : (i + 1)));
                const quint16 m1 = static_cast<quint16>(borderMidBase + i);
                const quint16 m2 = static_cast<quint16>(borderMidBase + ((i + 1 == N) ? 0 : (i + 1)));
                addQuad(f1, m1, f2, m2);
            }

            // Outer fringe (border -> background)
            for (int i = 0; i < N; ++i) {
                const quint16 m1 = static_cast<quint16>(borderMidBase + i);
                const quint16 m2 = static_cast<quint16>(borderMidBase + ((i + 1 == N) ? 0 : (i + 1)));
                const quint16 o1 = static_cast<quint16>(outFringeBase + i);
                const quint16 o2 = static_cast<quint16>(outFringeBase + ((i + 1 == N) ? 0 : (i + 1)));
                addQuad(m1, o1, m2, o2);
            }
        } else {
            // Fill + Thick border: center -> fill perimeter (m_color) -> inner core (bc) -> outer core (bc) -> outer fringe (0)
            const int inCoreBase = fillBase + N;
            const int outCoreBase = inCoreBase + N;
            const int outFringeBase = outCoreBase + N;

            for (int i = 0; i < N; ++i) {
                const QPointF pFill = outerPoints[i] - bw * outerNormals[i];
                const QPointF pInCo = outerPoints[i] - (bw - f) * outerNormals[i];
                const QPointF pOutCo = outerPoints[i] - f * outerNormals[i];
                const QPointF pOutFr = outerPoints[i] + f * outerNormals[i];

                v[fillBase + i].set(static_cast<float>(pFill.x()), static_cast<float>(pFill.y()), fr, fg, fb, fa);
                v[inCoreBase + i].set(static_cast<float>(pInCo.x()), static_cast<float>(pInCo.y()), br, bg, bb, ba);
                v[outCoreBase + i].set(static_cast<float>(pOutCo.x()), static_cast<float>(pOutCo.y()), br, bg, bb, ba);
                v[outFringeBase + i].set(static_cast<float>(pOutFr.x()), static_cast<float>(pOutFr.y()), zr, zg, zb, za);
            }

            // Fill fan
            for (int i = 0; i < N; ++i) {
                const quint16 c1 = static_cast<quint16>(fillBase + i);
                const quint16 c2 = static_cast<quint16>(fillBase + ((i + 1 == N) ? 0 : (i + 1)));
                indices[idxOffset++] = static_cast<quint16>(vertOffset + 0);
                indices[idxOffset++] = c1;
                indices[idxOffset++] = c2;
            }

            // Inner transition band (fill -> border)
            for (int i = 0; i < N; ++i) {
                const quint16 f1 = static_cast<quint16>(fillBase + i);
                const quint16 f2 = static_cast<quint16>(fillBase + ((i + 1 == N) ? 0 : (i + 1)));
                const quint16 i1 = static_cast<quint16>(inCoreBase + i);
                const quint16 i2 = static_cast<quint16>(inCoreBase + ((i + 1 == N) ? 0 : (i + 1)));
                addQuad(f1, i1, f2, i2);
            }

            // Solid border body
            for (int i = 0; i < N; ++i) {
                const quint16 i1 = static_cast<quint16>(inCoreBase + i);
                const quint16 i2 = static_cast<quint16>(inCoreBase + ((i + 1 == N) ? 0 : (i + 1)));
                const quint16 o1 = static_cast<quint16>(outCoreBase + i);
                const quint16 o2 = static_cast<quint16>(outCoreBase + ((i + 1 == N) ? 0 : (i + 1)));
                addQuad(i1, o1, i2, o2);
            }

            // Outer fringe
            for (int i = 0; i < N; ++i) {
                const quint16 o1 = static_cast<quint16>(outCoreBase + i);
                const quint16 o2 = static_cast<quint16>(outCoreBase + ((i + 1 == N) ? 0 : (i + 1)));
                const quint16 fr1 = static_cast<quint16>(outFringeBase + i);
                const quint16 fr2 = static_cast<quint16>(outFringeBase + ((i + 1 == N) ? 0 : (i + 1)));
                addQuad(o1, fr1, o2, fr2);
            }
        }
    }

    geom->markVertexDataDirty();
    geom->markIndexDataDirty();
    node->markDirty(QSGNode::DirtyGeometry);

    return node;
}
